import type { INewReestrContexMenuItems } from "../../../components/NewReestr/types/newReestrContexMenuItems";

import { NEW_TABLE_DEFAULT_ROW_TYPE } from "../../../components/NewTable/constants/defaultRowType";
import { NEW_TABLE_STANDART_ROW_MODES } from "../../../components/NewTable/constants/standartRowModes";

export const testContextMenuItems: INewReestrContexMenuItems = {
  [NEW_TABLE_DEFAULT_ROW_TYPE]: [
    {
      label: 'Row operations',
      children: [
        {
          label: 'Edit Row',
          actionName: 'edit-row',
          modes: [NEW_TABLE_STANDART_ROW_MODES.VIEW],
        },
        {
          label: 'Save Row',
          actionName: 'save-row',
          modes: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
        },
        {
          label: 'Delete Row',
          actionName: 'delete-row',
        },
      ],
    },
    {
      label: 'Cell operations',
      children: [
        {
          label: 'Show Cell Info',
          actionName: 'cell-info',
        },

      ],
    },
    {
      label: 'Change row parent',
      actionName: 'change-row-parent',
    },
  ]
};