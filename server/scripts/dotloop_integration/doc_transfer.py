from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import ElementClickInterceptedException, StaleElementReferenceException
from selenium.webdriver.chrome.options import Options
from urllib.parse import urljoin, unquote
import json
import os
import time
import requests
import boto3
from botocore.exceptions import ClientError

BUCKET_NAME = "jpar-dotloop-contracts"
DOWNLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "contracts/tony-contracts")
    

def upload_to_s3(file_path, bucket=BUCKET_NAME, object_name=None):
    """Upload a file to an S3 bucket
    
    :param file_path: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """
    if object_name is None:
        object_name = os.path.basename(file_path)

    s3_client = boto3.client('s3')
    try:
        s3_client.upload_file(file_path, bucket, object_name)
        print(f"Uploaded {object_name} to S3 bucket {bucket}")
        return True
    except ClientError as e:
        print(f"Error uploading to S3: {str(e)}")
        return False


def selenium_login_and_save_cookies():
    driver = webdriver.Chrome()
    driver.get("https://login.showingtimeplus.com")

    with open(os.path.join(os.path.dirname(__file__), "config.json")) as f:
        config = json.load(f)

    password = config["dotloop_password"]
    email = config["dotloop_email"]
    
    # Create the download directory if it doesn't exist
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)

    # Chrome download settings
    chrome_options = Options()
    chrome_options.add_experimental_option("prefs", {
        "download.default_directory": DOWNLOAD_DIR,
        "download.prompt_for_download": False,
        "directory_upgrade": True,
        "safebrowsing.enabled": True,
        "profile.default_content_setting_values.automatic_downloads": 1,
        "profile.default_content_settings.geolocation": 1,
        "profile.default_content_setting_values.notifications": 1
    })

    driver = webdriver.Chrome(options=chrome_options)
    wait = WebDriverWait(driver, 100)

    driver.get("https://login.showingtimeplus.com/u/login/identifier?state=hKFo2SBxRC1IQjBqeGNMQlJQZ0p0SEFsOXEzSnppOUxPYnMzcqFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIEtPLV9faEY1eDBWYkg4Tlp5Nm15T1VoLXJkUExlaG9No2NpZNkgQzBva1VPcEVzMG43cUVmNHlFa21yVDdkRVpQbmV6Vnc")

    # Fill email
    driver.find_element(By.ID, "username").send_keys(email)
    driver.find_element(By.XPATH, '//button[text()="Continue"]').click()

    wait.until(EC.visibility_of_element_located((By.XPATH, '//input[@id="password"]')))
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.XPATH, '//button[text()="Continue"]').click()

    # Wait for 2FA
    input("Press Enter once you complete 2nd factor authentication...")

    all_cookies = driver.execute_cdp_cmd("Network.getAllCookies", {})["cookies"]

    # Save them
    with open("cookies.json", "w") as f:
        json.dump(all_cookies, f, indent=2)

    return driver


def request_session_with_cookies():
    if not os.path.exists("cookies.json"):
        print("No cookies found, logging in with Selenium...")
        selenium_login_and_save_cookies()

    with open("cookies.json", "r") as f:
        cookies_list = json.load(f)

    session = requests.Session()
    cookie_dict = {}

    for cookie in cookies_list:
        session.cookies.set(cookie["name"], cookie["value"])
        cookie_dict[cookie["name"]] = cookie["value"]

    return session, cookie_dict


def get_loops(session, page_num=0):
    params = {
        "page[size]": 12,
        "page[num]": page_num,  # Change this dynamically when paginating
        "filter[archivedFilter]": "ALL",
        "filter[invitationStatus]": "ALL",
        "filter[statusIds]": 4,
        "sort": "createdDate"
    }
    headers = {
        "accept": "application/vnd.api+json",
        "content-type": "application/vnd.api+json",
        "origin": "https://my.dotloop.com",
        "referer": "https://my.dotloop.com/",
        "x-dotloop-profile-id": "18029546",
        "x-xsrf-token": "cf327d91-a338-4ca3-9d11-b086c998eaaa",  # comes from your cookies
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
    }

    r = session.get(
        "https://www.dotloop.com/vega/v1_0/search/loops",
        headers=headers,
        params=params
    )

    if r.status_code != 200:
        raise Exception(f"Failed to get loops: {r.status_code} {r.text}")

    return r.json()

def get_all_loops(session, max_pages=100):
    all_loops = []
    page_num = 0
    while page_num < max_pages:
        print(f"Getting page {page_num}")
        loops = get_loops(session, page_num)
        all_loops.extend(loops["data"])
        if len(loops["data"]) < 12:
            break
        page_num += 1
    return all_loops


def get_loop_documents_selenium(driver, loop_id, upload=False):
    wait = WebDriverWait(driver, 20)
    LOOP_URL = f"https://www.dotloop.com/my/loop/{loop_id}"
    driver.get(LOOP_URL)
    time.sleep(5)

    total_docs = len(driver.find_elements(By.CSS_SELECTOR, "li.document-list-item.document"))

    index = 0
    while index < total_docs:
        try:
            print(f"Processing document {index+1}/{total_docs}")

            document_items = driver.find_elements(By.CSS_SELECTOR, "li.document-list-item.document")
            item = document_items[index]

            document_name = item.find_element(By.CSS_SELECTOR, "div.document-name-parent.pull-left > div > div.pull-left.document-name-container.bold > a").text

            dropdown_button = item.find_element(By.CSS_SELECTOR, "div.document-options > a.more-options")
            driver.execute_script("arguments[0].click();", dropdown_button)

            download_option = item.find_element(By.CSS_SELECTOR, "ul.dropdown-menu li a.download")
            driver.execute_script("arguments[0].click();", download_option)

            # Wait and click OK in modal
            ok_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "div.modal-footer > a")))
            ok_button.click()

            # Wait for modal to disappear
            wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, "div.modal-backdrop")))
            wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, "div.fixed-modal-container")))

            if upload:
                upload_to_s3(os.path.join(DOWNLOAD_DIR, f"{document_name}.pdf"), object_name=f"{loop_id}/{document_name}.pdf")

            index += 1

        except ElementClickInterceptedException:
            print(f"Click intercepted at document {index+1}, waiting for modal cleanup...")
            # wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, "div.fixed-modal-container")))
            # time.sleep(0.5)
            index += 1
            continue  # Retry current document (but avoid re-clicking download)

        except StaleElementReferenceException:
            print(f"Stale element at document {index+1}, reloading item...")
            time.sleep(1)
            continue

        except Exception as e:
            print(f"General error on document {index+1}: {e}")
            index += 1




if __name__ == "__main__":
    driver = selenium_login_and_save_cookies()
    session, cookie_dict = request_session_with_cookies()

    all_loops = get_all_loops(session, max_pages=1)

    for loop in all_loops:
        get_loop_documents_selenium(driver, loop['id'], upload=True)
        break
    driver.quit()
    # document_name = "Tax Sheet"
    # upload_to_s3(os.path.join(DOWNLOAD_DIR, f"{document_name}.pdf"), object_name=f"{123456}/{document_name}.pdf")