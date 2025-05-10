import os
import requests
import boto3
from urllib.parse import urljoin, unquote
from bs4 import BeautifulSoup
from botocore.exceptions import ClientError

BUCKET_NAME = "jpar-dotloop-contracts"

def upload_to_s3(file_path, bucket, object_name=None):
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

def download_pdf(url, output_dir, s3_bucket):
    try:
        # Get the filename from the URL and decode any URL encoding
        filename = unquote(os.path.basename(url))
        output_path = os.path.join(output_dir, filename)
        
        # Don't download if file already exists
        if os.path.exists(output_path):
            print(f"Skipping {filename} - already exists")
            return
        
        # Download the PDF
        response = requests.get(url)
        response.raise_for_status()
        
        # Check if it's actually a PDF
        if 'application/pdf' not in response.headers.get('content-type', '').lower():
            print(f"Warning: {url} may not be a PDF file")
        
        # Save the file
        with open(output_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded {filename}")
        
        # Upload to S3
        upload_to_s3(output_path, s3_bucket, filename)
        
    except Exception as e:
        print(f"Error downloading {url}: {str(e)}")

def get_links(url):
    try:
        # Get the page content
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all links
        links = soup.find_all('a')
        return links
    except Exception as e:
        print(f"Error accessing the webpage: {str(e)}")
        return []

def get_links(url):
    """Get all PDF links from a webpage.
    
    :param url: URL of the webpage to scrape
    :return: tuple of (list of PDF URLs, count of PDFs found)
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all links
        links = soup.find_all('a')
        
        # Get PDF links
        pdf_links = []
        for link in links:
            href = link.get('href')
            if href and href.lower().endswith('.pdf'):
                full_url = urljoin(url, href)
                pdf_links.append(full_url)
        
        return pdf_links, len(pdf_links)
        
    except Exception as e:
        print(f"Error accessing the webpage: {str(e)}")
        return [], 0

def main():
    # Create output directory if it doesn't exist
    output_dir = 'contracts-pdf'
    os.makedirs(output_dir, exist_ok=True)
    
    # S3 bucket name
    s3_bucket = BUCKET_NAME
    
    url = 'https://www.aaronline.com/manage-risk/sample-forms/aar-brings-you-standard-forms/'
    
    # Get PDF links from the webpage
    pdf_links, pdf_count = get_links(url)
    
    # Download each PDF
    for pdf_url in pdf_links:
        download_pdf(pdf_url, output_dir, s3_bucket)
    
    print(f"\nFinished! Found {pdf_count} PDF links")

if __name__ == '__main__':
    main()