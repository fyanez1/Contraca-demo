import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import CommissionDisbursementAuthorizationView from "../views/CommissionDisbursementAuthorizationView.vue";
import DocumentsView from "../views/DocumentsView.vue";
import ExtractingDataView from "../views/ExtractingDataView.vue";
import FinishedDocumentsView from "../views/FinishedDocumentsView.vue";
import GeneratedDocumentView from "../views/GeneratedDocumentView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SettingView from "../views/SettingView.vue";
import TransactionsView from "../views/TransactionsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/documents",
      name: "Documents",
      component: DocumentsView,
    },
    {
      path: "/transactions",
      name: "Transactions",
      component: TransactionsView,
    },
    {
      path: "/finished-documents",
      name: "Post-Closing Documents",
      component: FinishedDocumentsView,
    },
    {
      path: "/extracting",
      name: "ExtractingData",
      component: ExtractingDataView,
    },
    {
      path: "/commission-disbursement-authorization",
      name: "CommissionDisbursementAuthorization",
      component: CommissionDisbursementAuthorizationView,
    },
    {
      path: "/generated-document",
      name: "GeneratedDocument",
      component: GeneratedDocumentView,
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
