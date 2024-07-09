import { lazy, Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
// auth
import { AuthGuard } from "src/auth/guard";
// layouts
import DashboardLayout from "src/layouts/dashboard";
// components
import { LoadingScreen } from "src/components/loading-screen";
import SystemDefaultSetup from "src/sections/master-file-setup/MasterSetup";
import AutoNoList from "src/sections/master-file-setup/MasterAssetNo/AutoNoList";
import CraftCodeList from "src/sections/master-file-setup/MasterCraftCode/CraftCodeList";
import AccountPeriodList from "src/sections/master-file-setup/AccountingPeriod/AccountPeriodList";
import MasterGroupList from "src/sections/master-file-setup/MasterUserGroup/MasterGroupList";
import MasterCategoryStatusList from "src/sections/master-file-setup/MasterCategoryStatus/MasterCategoryStatusList";
import StatusTypeList from "src/sections/master-file-setup/MasterStatusType/StatusTypeList";
import CostCenterList from "src/sections/master-file-setup/MasterCostCenter/CostCenterList";
import AccountList from "src/sections/master-file-setup/MasterAccount/AccountList";
import CurrencyList from "src/sections/master-file-setup/CurrencyCode/CurrencyList";
import TaxCodeList from "src/sections/master-file-setup/TaxCode/TaxCodeList";
import BudgetList from "src/sections/master-file-setup/Budget/BudgetList";
import BudgetADDDialog from "src/sections/master-file-setup/Budget/BudgetADDDialog";
import DashboardSummary from "src/sections/overview/app/view/dashboard-summary";

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import("src/pages/dashboard/app"));
const OverviewEcommercePage = lazy(() =>
  import("src/pages/dashboard/ecommerce")
);
const OverviewAnalyticsPage = lazy(() =>
  import("src/pages/dashboard/analytics")
);
const OverviewBankingPage = lazy(() => import("src/pages/dashboard/banking"));
const OverviewBookingPage = lazy(() => import("src/pages/dashboard/booking"));
const OverviewFilePage = lazy(() => import("src/pages/dashboard/file"));
// PRODUCT
const ProductDetailsPage = lazy(() =>
  import("src/pages/dashboard/product/details")
);
const ProductListPage = lazy(() => import("src/pages/dashboard/product/list"));
const ProductCreatePage = lazy(() => import("src/pages/dashboard/product/new"));
const ProductEditPage = lazy(() => import("src/pages/dashboard/product/edit"));
// ORDER
const OrderListPage = lazy(() => import("src/pages/dashboard/order/list"));
const OrderDetailsPage = lazy(() =>
  import("src/pages/dashboard/order/details")
);
// INVOICE
const InvoiceListPage = lazy(() => import("src/pages/dashboard/invoice/list"));
const InvoiceDetailsPage = lazy(() =>
  import("src/pages/dashboard/invoice/details")
);
const InvoiceCreatePage = lazy(() => import("src/pages/dashboard/invoice/new"));
const InvoiceEditPage = lazy(() => import("src/pages/dashboard/invoice/edit"));
// USER
const UserProfilePage = lazy(() => import("src/pages/dashboard/user/profile"));
const UserCardsPage = lazy(() => import("src/pages/dashboard/user/cards"));
const UserListPage = lazy(() => import("src/pages/dashboard/user/list"));
const UserAccountPage = lazy(() => import("src/pages/dashboard/user/account"));
const UserCreatePage = lazy(() => import("src/pages/dashboard/user/new"));
const UserEditPage = lazy(() => import("src/pages/dashboard/user/edit"));

// ASSET
const AssetList = lazy(() => import("src/sections/Asset/Asset_List"));
const AssetNewFrom = lazy(() =>
  import("src/sections/Asset/Form/CreateAssetFrom")
);
const AssetListReport = lazy(() =>
  import("src/sections/Asset/Asset_report/AssetListReport")
);
const AssetPrintQrCode = lazy(() =>
  import("src/sections/Asset/Asset_QrcodePrint/AssetPrintQrCode")
);
//Preventive Setup
const PreventiveMaintenance = lazy(() =>
  import("src/sections/Preventive_setup/PreventiveMaintenance")
);
const PreventiveMaintenanceForm = lazy(() =>
  import("src/sections/Preventive_setup/Form/CreateNewPmform")
);

// Inventory Master
const InventoryMasterList = lazy(() =>
  import("src/sections/Inventory/InventoryMaster/InventoryMasterList")
);
const InventoryMasterForm = lazy(() =>
  import("src/sections/Inventory/InventoryMaster/Form/InventoryForm")
);
// Mantinance
const WorkReqList = lazy(() =>
  import("src/sections/maintenance/WorkRequestList")
);
const WorkOrderList = lazy(() =>
  import("src/sections/maintenance/WorkOrderList")
);
const WorkOrderNewFrom = lazy(() =>
  import("src/sections/maintenance/Form/WorkOrderNewFrom")
);
const WorkRequestForm = lazy(() =>
  import("src/sections/maintenance/Form/WorkRequestForm")
);

// BLOG
const BlogPostsPage = lazy(() => import("src/pages/dashboard/post/list"));
const BlogPostPage = lazy(() => import("src/pages/dashboard/post/details"));
const BlogNewPostPage = lazy(() => import("src/pages/dashboard/post/new"));
const BlogEditPostPage = lazy(() => import("src/pages/dashboard/post/edit"));
// JOB
const JobDetailsPage = lazy(() => import("src/pages/dashboard/job/details"));
const JobListPage = lazy(() => import("src/pages/dashboard/job/list"));
const JobCreatePage = lazy(() => import("src/pages/dashboard/job/new"));
const JobEditPage = lazy(() => import("src/pages/dashboard/job/edit"));
// TOUR
const TourDetailsPage = lazy(() => import("src/pages/dashboard/tour/details"));
const TourListPage = lazy(() => import("src/pages/dashboard/tour/list"));
const TourCreatePage = lazy(() => import("src/pages/dashboard/tour/new"));
const TourEditPage = lazy(() => import("src/pages/dashboard/tour/edit"));
// FILE MANAGER
const FileManagerPage = lazy(() => import("src/pages/dashboard/file-manager"));
// APP
const ChatPage = lazy(() => import("src/pages/dashboard/chat"));
const MailPage = lazy(() => import("src/pages/dashboard/mail"));
const CalendarPage = lazy(() => import("src/pages/dashboard/calendar"));
const KanbanPage = lazy(() => import("src/pages/dashboard/kanban"));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() =>
  import("src/pages/dashboard/permission")
);
// BLANK PAGE
const BlankPage = lazy(() => import("src/pages/dashboard/blank"));

// ----------------------------------------------------------------------
const PrivateRoute = ({ children }) => {
  const UserLoginId = localStorage.getItem("emp_mst_login_id");

  if (!UserLoginId) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
export const dashboardRoutes = [
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </PrivateRoute>
    ),

    children: [
      { element: <IndexPage />, index: true },
      { path: "ecommerce", element: <OverviewEcommercePage /> },
      { path: "analytics", element: <OverviewAnalyticsPage /> },
      { path: "banking", element: <OverviewBankingPage /> },
      { path: "booking", element: <OverviewBookingPage /> },
      { path: "file", element: <OverviewFilePage /> },
      {
        path: "user",
        children: [
          { element: <UserProfilePage />, index: true },
          { path: "profile", element: <UserProfilePage /> },
          { path: "cards", element: <UserCardsPage /> },
          { path: "list", element: <UserListPage /> },
          { path: "new", element: <UserCreatePage /> },
          { path: ":id/edit", element: <UserEditPage /> },
          { path: "account", element: <UserAccountPage /> },
        ],
      },
      {
        path: "summary",
        children: [
          { element: <DashboardSummary />, index: true },

          { path: "summary", element: <DashboardSummary /> },
        ],
      },
      {
        path: "asset",
        children: [
          { element: <AssetList />, index: true },

          { path: "list", element: <AssetList /> },
          { path: "newasset", element: <AssetNewFrom /> },
          { path: "assetReport", element: <AssetListReport /> },
          { path: "assetPrintQr", element: <AssetPrintQrCode /> },
        ],
      },
      {
        path: "work",
        children: [
          { element: <WorkReqList />, index: true },
          { path: "list", element: <WorkReqList /> },
          { path: "order", element: <WorkOrderList /> },
          { path: "neworder", element: <WorkOrderNewFrom /> },
          { path: "newRequest", element: <WorkRequestForm /> },
        ],
      },
      {
        path: "PreventiveSetup",
        children: [
          { element: <PreventiveMaintenance />, index: true },
          { path: "Maintenance", element: <PreventiveMaintenance /> },
          { path: "newpmform", element: <PreventiveMaintenanceForm /> },
        ],
      },
      {
        path: "InventoryMaster",
        children: [
          { element: <InventoryMasterList />, index: true },
          { path: "list", element: <InventoryMasterList /> },
          { path: "inventoryform", element: <InventoryMasterForm /> },
        ],
      },

      {
        path: "product",
        children: [
          { element: <ProductListPage />, index: true },
          { path: "list", element: <ProductListPage /> },
          { path: ":id", element: <ProductDetailsPage /> },
          { path: "new", element: <ProductCreatePage /> },
          { path: ":id/edit", element: <ProductEditPage /> },
        ],
      },
      {
        path: "order",
        children: [
          { element: <OrderListPage />, index: true },
          { path: "list", element: <OrderListPage /> },
          { path: ":id", element: <OrderDetailsPage /> },
        ],
      },
      {
        path: "invoice",
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: "list", element: <InvoiceListPage /> },
          { path: ":id", element: <InvoiceDetailsPage /> },
          { path: ":id/edit", element: <InvoiceEditPage /> },
          { path: "new", element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: "post",
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: "list", element: <BlogPostsPage /> },
          { path: ":title", element: <BlogPostPage /> },
          { path: ":title/edit", element: <BlogEditPostPage /> },
          { path: "new", element: <BlogNewPostPage /> },
        ],
      },
      {
        path: "job",
        children: [
          { element: <JobListPage />, index: true },
          { path: "list", element: <JobListPage /> },
          { path: ":id", element: <JobDetailsPage /> },
          { path: "new", element: <JobCreatePage /> },
          { path: ":id/edit", element: <JobEditPage /> },
        ],
      },
      {
        path: "tour",
        children: [
          { element: <TourListPage />, index: true },
          { path: "list", element: <TourListPage /> },
          { path: ":id", element: <TourDetailsPage /> },
          { path: "new", element: <TourCreatePage /> },
          { path: ":id/edit", element: <TourEditPage /> },
        ],
      },

      // master file setup
      {
        path: "masterfile",
        children: [
          { element: <SystemDefaultSetup />, index: true },
          { path: "default-settings", element: <SystemDefaultSetup /> },
          { path: "master-user-group", element: <MasterGroupList /> },
          { path: "master-auto-no", element: <AutoNoList /> },
          { path: "craft-code", element: <CraftCodeList /> },
          { path: "accounting-peroid", element: <AccountPeriodList /> },
          {
            path: "category-status-list",
            element: <MasterCategoryStatusList />,
          },
          {
            path: "status-type",
            element: <StatusTypeList />,
          },
          {
            path: "cost-center",
            element: <CostCenterList />,
          },
          {
            path: "account",
            element: <AccountList />,
          },
          {
            path: "currency-code",
            element: <CurrencyList />,
          },
          {
            path: "tax-code",
            element: <TaxCodeList />,
          },
          {
            path: "budget",

            children: [
              { element: <BudgetList />, index: true },

              {
                path: "new",
                element: <BudgetADDDialog />,
              },
            ],
          },
        ],
      },

      { path: "file-manager", element: <FileManagerPage /> },
      { path: "mail", element: <MailPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "kanban", element: <KanbanPage /> },
      { path: "permission", element: <PermissionDeniedPage /> },
      { path: "blank", element: <BlankPage /> },
    ],
  },
];
