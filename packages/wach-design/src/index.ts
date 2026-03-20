/**
 * wach-design 入口：样式 Token + 全量注册
 */
import type { App, Plugin } from "vue";
import "./styles/tokens.css";
import WachButton from "./components/button/WachButton.vue";
import WachTabs from "./components/tabs/WachTabs.vue";
import WachTab from "./components/tabs/WachTab.vue";
import WachRadio from "./components/radio/WachRadio.vue";
import WachRadioGroup from "./components/radio/WachRadioGroup.vue";
import WachCategorySearch from "./components/category-search/WachCategorySearch.vue";
import WachPageHeader from "./components/page-header/WachPageHeader.vue";
import WachAccordion from "./components/accordion/WachAccordion.vue";
import WachAccordionItem from "./components/accordion/WachAccordionItem.vue";
import WachAccordionSubItem from "./components/accordion/WachAccordionSubItem.vue";
import WachForm from "./components/form/WachForm.vue";
import WachFormItem from "./components/form/WachFormItem.vue";
import WachFormInput from "./components/form/WachFormInput.vue";
import WachTable from "./components/table/WachTable.vue";
import WachTableColumn from "./components/table/WachTableColumn.vue";

export type { FormRule, FormRules } from "./components/form/formTypes";
export type {
  TableColumnMeta,
  TableColumnAlign,
} from "./components/table/tableTypes";

export {
  WachButton,
  WachTabs,
  WachTab,
  WachRadio,
  WachRadioGroup,
  WachCategorySearch,
  WachPageHeader,
  WachAccordion,
  WachAccordionItem,
  WachAccordionSubItem,
  WachForm,
  WachFormItem,
  WachFormInput,
  WachTable,
  WachTableColumn,
};

const install: Plugin["install"] = (app: App) => {
  app.component("WachButton", WachButton);
  app.component("WachTabs", WachTabs);
  app.component("WachTab", WachTab);
  app.component("WachRadio", WachRadio);
  app.component("WachRadioGroup", WachRadioGroup);
  app.component("WachCategorySearch", WachCategorySearch);
  app.component("WachPageHeader", WachPageHeader);
  app.component("WachAccordion", WachAccordion);
  app.component("WachAccordionItem", WachAccordionItem);
  app.component("WachAccordionSubItem", WachAccordionSubItem);
  app.component("WachForm", WachForm);
  app.component("WachFormItem", WachFormItem);
  app.component("WachFormInput", WachFormInput);
  app.component("WachTable", WachTable);
  app.component("WachTableColumn", WachTableColumn);
};

/** 全量安装：app.use(WachDesign) */
const WachDesign: Plugin = { install };

export default WachDesign;

export { install };
