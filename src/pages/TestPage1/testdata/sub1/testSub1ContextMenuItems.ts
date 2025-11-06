import type { INewReestrContexMenuItems } from "../../../../components/NewReestr/types/newReestrTypes";

import { NEW_TABLE_DEFAULT_ROW_TYPE } from "../../../../components/NewTable/constants/defaults";
import { NEW_TABLE_STANDART_ROW_MODES } from "../../../../components/NewTable/constants/standartRowModes";

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
      label: 'Show Cell Info',
      actionName: 'cell-info',
    },
  ],
};