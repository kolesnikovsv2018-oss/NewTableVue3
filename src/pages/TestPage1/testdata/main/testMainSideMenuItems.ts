import type { INewMenuItem } from "../../../components/NewContextMenu/types";

import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faSquareRootVariable } from "@fortawesome/free-solid-svg-icons";

export const testSideMenuItems: INewMenuItem[] = [
  {
    label: 'Date filter',
    actionName: 'date-filter',
    icon: faCalendarDays,
  },
  {
    label: 'Summs',
    actionName: 'summs',
    icon: faSquareRootVariable,
  },
];