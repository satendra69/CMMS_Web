import { Component, useEffect, useState, useMemo } from "react";
// routes
import { paths } from "src/routes/paths";
// locales
import { useLocales } from "src/locales";
import httpCommon from "src/http-common";
// components
import SvgColor from "src/components/svg-color";

// icon menu import

import Icon_Asset from "../../assets/icons/MenuIcon/IconAsset.png";
import IconCheckList from "../../assets/icons/MenuIcon/IconCheckList.png";
import IconMaintenance from "../../assets/icons/MenuIcon/IconMaintenance.png";
import IconInventory from "../../assets/icons/MenuIcon/IconInventory.png";
import IconPurchase from "../../assets/icons/MenuIcon/IconPurchase.png";
import IconPreventive from "../../assets/icons/MenuIcon/IconPreventive.png";
import IconPersonnel from "../../assets/icons/MenuIcon/IconPersonnel.png";
import IconWorkSchedule from "../../assets/icons/MenuIcon/IconWorkSchedule.png";
import IconCustomerInvoice from "../../assets/icons/MenuIcon/IconCustomerInvoice.png";
import IconDashboard from "../../assets/icons/MenuIcon/IconDashboard.png";
import IconKPI from "../../assets/icons/MenuIcon/IconKPI.png";
import IconNotification from "../../assets/icons/MenuIcon/IconNotification.png";
import IconMasterFileSetup from "../../assets/icons/MenuIcon/IconMasterFileSetup.png";
import IconAdmin from "../../assets/icons/MenuIcon/IconAdmin.png";
import IconMobile from "../../assets/icons/MenuIcon/IconMobile.png";
import IconOption from "../../assets/icons/MenuIcon/IconOption.png";
import ApplicationIcon from "../../assets/icons/Application_iconSubmenu.png";
import ReportIcon from "../../assets/icons/Report_iconSubmenu.png";
import Invoice from "../../assets/icons/MenuIcon/Invoice_icon.png";

const imageMapping = {
  AST: Icon_Asset,
  CHK: IconCheckList,
  MAN: IconMaintenance,
  INV: IconInventory,
  PUR: IconCheckList,
  PM: IconPreventive,
  DOC: IconCustomerInvoice,
  PER: IconPersonnel,
  "P&S": IconWorkSchedule,
  VOI: Invoice,
  DSH: IconDashboard,
  "KPI ": IconKPI,
  NOT: IconNotification,
  BUD: IconPurchase,
  MST: IconMasterFileSetup,
  SYS: IconAdmin,
  MBL: IconMobile,
  IconPurchase: IconPurchase,
  Option: IconOption,
};

const SubMenuLink = {
  w_ast_manager: "asset/list",
  wr_asset_list: "asset/assetReport",
  w_ast_usg_manager: "user",
  w_prm_manager: "PreventiveSetup/Maintenance",
  Employee: "user/account",
  w_wkr_manager: "work/list",
  w_wko_manager: "work/order",
  w_itm_manager: "InventoryMaster/list",
  w_dft_mst_manager: "masterfile/default-settings",
  w_cnt_manager: "masterfile/master-auto-no",
  w_usr_grp_manager: "masterfile/master-user-group",
  w_crf_mst_manager: "masterfile/craft-code",
  w_acct_period_manager: "masterfile/accounting-peroid",
  w_sts_cat: "masterfile/category-status-list",
  w_sts_typ: "masterfile/status-type",
  w_cost_center_manager: "masterfile/cost-center",
  w_account_manager: "masterfile/account",
  w_cur_mst_manager: "masterfile/currency-code",
  w_tax_mst_manager: "masterfile/tax-code",
  w_dashboard_summary:"summary",

  //"Work Order Lite": "work/list",
  // 'Dashboard Setup': 'Dashboard',
  //PreventiveSetup/Maintenance
};

const Submenuimg = {
  Application: ApplicationIcon,
  Report: ReportIcon,
};

// ----------------------------------------------------------------------

export function useNavData() {
  const site_ID = localStorage.getItem("site_ID");
  const empLoginId = localStorage.getItem("emp_mst_login_id");

  const [menuItems, setMenuItems] = useState([]);

  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const fetchSideBarMenuList = async () => {
      try {
        const url = `/getSideBarMenuList.php?site_cd=${site_ID}&emp_mst_empl_id=${empLoginId}`;
        const response = await httpCommon.get(url);
       // console.log("response____menu", response);
        if (response.data.data.length > 0) {
          const processedMenuItems = response.data.data.reduce((acc, item) => {
            const existingMenuItem = acc.find(
              (menu) => menu.label === item.cf_module_desc
            );

            const reportSubmenu = {
              label: item.object_descs,
              img: Submenuimg[item.type],
              report: item.type === "Report",
              Url: SubMenuLink[item.object_name],
            };

            if (existingMenuItem) {
              if (item.type === "Report") {
                const reportsMenuIndex = existingMenuItem.submenus.findIndex(
                  (submenu) => submenu.label === "Reports"
                );
                if (reportsMenuIndex !== -1) {
                  existingMenuItem.submenus[reportsMenuIndex].submenus.push(
                    reportSubmenu
                  );
                } else {
                  existingMenuItem.submenus.push({
                    label: "Reports",
                    submenus: [reportSubmenu],
                  });
                }
              } else {
                existingMenuItem.submenus.push(reportSubmenu);
              }
            } else {
              // Create a new menu item
              const newMenuItem = {
                id: acc.length + 1,
                label: item.cf_module_desc,
                submenus: [],
                img: imageMapping[item.cf_module_module_cd],
                imgsub: Submenuimg[item.type],
                Url: SubMenuLink[item.object_descs],
              };
              if (item.type === "Report") {
                newMenuItem.submenus.push({
                  label: "Reports",
                  submenus: [reportSubmenu],
                });
              } else {
                newMenuItem.submenus.push(reportSubmenu);
              }
              acc.push(newMenuItem);
            }
            return acc;
          }, []);
          setMenuItems(processedMenuItems);
        }
      } catch (error) {
        // Handle errors here
      }
    };
    fetchSideBarMenuList();
  }, [site_ID, empLoginId]);

  const { t } = useLocales();

  const handleMenuClick = (menuName) => {
    debugger;
    // Add your logic here to handle the clicked menu
  };

  // console.log("menuItems______",menuItems);
  const data = useMemo(
    () =>
      menuItems.map((item) => ({
        items: [
          {
            title: t(item.label),
            path: item.Url ? `/dashboard/${item.Url}` : "",
            icon: (
              <img src={item.img} alt={item.label} className="menuIMGName" />
            ),
            children: item.submenus.map((submenu) => ({
              title: submenu.label,
              path: submenu.Url ? `/dashboard/${submenu.Url}` : "",
              onClick: function () {
                // Handle regular menu item click
                handleMenuClick(submenu.label);
              },
              ...(submenu.label === "Reports" && {
                children: submenu.submenus.map((reportSubMenu) => ({
                  title: reportSubMenu.label,
                  path: reportSubMenu.Url
                    ? `/dashboard/${reportSubMenu.Url}`
                    : "",
                  onMouseDown: function (e) {
                    e.preventDefault(); // Prevent default behavior
                    e.stopPropagation(); // Prevent event propagation
                    // handleMenuClick(reportSubMenu.label);
                  },
                  onClick: function () {
                    // Handle submenu item click
                    handleMenuClick(reportSubMenu.label);
                  },
                })),
              }),
            })),
          },
        ],
      })),
    [menuItems, t, handleMenuClick]
  );
  const dataX = [
    {
      items: [
        {
          title: "Asset",
          path: "/dashboard/asset",
          children: [
            {
              title: "Asset Register",
              path: "/dashboard/asset/list",
            },
            {
              title: "Asset Meter",
              path: "/dashboard/asset/user",
            },
            {
              title: "Asset Relocation",
              path: "",
            },
            {
              title: "Work Area Relocation",
              path: "",
            },
            {
              title: "Asset Hierarchy",
              path: "",
            },
          ],
        },
        {
          title: "Asset order",
          path: "/dashboard/work/order",
          children: [
            {
              title: "Asset Register order",
              path: "/dashboard/work/list",
            },
            {
              title: "Asset Meter order",
              path: "/dashboard/work/neworder",
            },
            {
              title: "Asset Relocation",
              path: "/dashboard/work/newRequest",
            },
            {
              title: "Work Area Relocation",
              path: "",
            },
          ],
        },
      ],
    },
  ];

  return data;
}
