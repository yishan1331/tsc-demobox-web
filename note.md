#### 頁面增加需修改之檔案

1. data `accessList`
   裡面的key必須跟router的name一模一樣
2. `web/src/router/childRouter.ts`
3. `web/src/stores/user-auth.ts` -> `DEFAULT_pageAccess`
4. `web/src/components/sidebar/NavigationRoutes.ts`
5. `web/src/services/utils.ts` -> `PageAccess`
6. `web/src/pages/settings/permission/widgets/EditPermissionForm.vue` -> `defaultPermissionNodes`
