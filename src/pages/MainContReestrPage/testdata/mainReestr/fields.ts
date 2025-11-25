export const contMainReestrFields = {
  "incomeStage.activity": {
    "name": "Классификатор",
    "search": true,
    "width": "48",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "assignDataClass ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 0,
    "editAttributes": {
      "stageClassificationEdit": {
        "type": "select",
        "options": {
          "value": {
            "": "Не выбрано",
            "pir": "ПИР",
            "pnr": "ПНР",
            "smr": "СМР",
            "others": "Прочие"
          }
        }
      }
    },
    "paramCalculateClasses": [
      "stageClassificationEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "tree": {
    "name": "Дерево",
    "search": true,
    "width": "56",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnTree ",
    "urlRow": "",
    "columnVisible": true,
    "sequenceColumn": 1,
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.number": {
    "name": "Номер",
    "search": true,
    "width": "74",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullLeft autoNumber incomeStageSearch incomeStageSearch ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 2,
    "editAttributes": {
      "reestrStageEdit": {
        "type": "text",
        "options": []
      },
      "moveEstimateEdit": {
        "type": "select",
        "options": {
          "value": [],
          "filterCriteria": {
            "incomeStageSearch": "without_childs"
          }
        }
      },
      "stageRemoveEdit": {
        "type": "select",
        "options": {
          "value": [],
          "filterCriteria": {
            "incomeStageSearch": "without_childs_self"
          }
        }
      }
    },
    "paramCalculateClasses": [
      "reestrStageEdit",
      "moveEstimateEdit",
      "stageRemoveEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.disableAutoCalc": {
    "name": "Рассчитан",
    "search": true,
    "width": "38",
    "sortType": "",
    "sortfunc": "",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 3,
    "editAttributes": {
      "reestrLeafStageEdit": {
        "type": "checkbox",
        "options": {
          "value": "1:0"
        }
      }
    },
    "paramCalculateClasses": [
      "reestrLeafStageEdit"
    ],
    "filterMap": "_incomeStage.disableAutoCalc",
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": "incomeBudget.StageAutoCalcFlagEditValuePreparer",
    "columnDataType": "boolean",
    "precision": null
  },
  "incomeStage.regNumber": {
    "name": "Доп. номер этапа",
    "search": true,
    "width": "79",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullLeft ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 4,
    "editAttributes": {
      "reestrStageEdit": {
        "type": "text",
        "options": []
      }
    },
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.limitSmr": {
    "name": "Лимит СМР",
    "search": true,
    "width": "48",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 5,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.limitOther": {
    "name": "Лимит Прочее",
    "search": true,
    "width": "48",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 6,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.limitTotal": {
    "name": "Лимит Итого",
    "search": true,
    "width": "32",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 7,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.tkpEquipment": {
    "name": "ТКП ОБ",
    "search": true,
    "width": "50",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullRight ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 8,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "calcColumnType",
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.manualEquipment": {
    "name": "ОБ ручн.",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 9,
    "editAttributes": {
      "reestrLeafStageEdit": {
        "type": "text",
        "options": []
      }
    },
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.tkpSmr": {
    "name": "ТКП СМР",
    "search": true,
    "width": "50",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullRight ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 10,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "calcColumnType",
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "estimate.regNumber": {
    "name": "Вн. номер сметы",
    "search": true,
    "width": "40",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullLeft columnPullLeft ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 11,
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.manualSmr": {
    "name": "СМР ручн.",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 12,
    "editAttributes": {
      "reestrLeafStageEdit": {
        "type": "text",
        "options": []
      }
    },
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.tkpOther": {
    "name": "ТКП Прочие",
    "search": true,
    "width": "50",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullRight ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 13,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "calcColumnType",
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.manualOther": {
    "name": "Прочие ручн.",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 14,
    "editAttributes": {
      "reestrLeafStageEdit": {
        "type": "text",
        "options": []
      }
    },
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.calcEquipment": {
    "name": "ОБ расч.",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput calcInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 15,
    "editAttributes": {
      "": {
        "type": "text",
        "options": []
      }
    },
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.calcSmr": {
    "name": "СМР расч.",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput calcInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 16,
    "editAttributes": {
      "": {
        "type": "text",
        "options": []
      }
    },
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.calcOther": {
    "name": "Прочие расч.",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput calcInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 17,
    "editAttributes": {
      "": {
        "type": "text",
        "options": []
      }
    },
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.calcTotal": {
    "name": "Итого расч.",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 18,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.manualTotal": {
    "name": "Итого ручн.",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 19,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.kind": {
    "name": "Вид этапа",
    "search": true,
    "width": "50",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullLeft ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 20,
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.costs": {
    "name": "Себестоимость",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 21,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit",
      "reestrEstimateEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.result": {
    "name": "Результат по этапу",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 22,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit",
      "reestrEstimateEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "estimate.number": {
    "name": "Смета",
    "search": true,
    "width": "286",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "estimate_item_search columnPullLeft ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 23,
    "editAttributes": {
      "reestrEstimateEdit": {
        "type": "select",
        "options": {
          "value": [],
          "filterCriteria": {
            "estimate_item_search": null
          }
        }
      }
    },
    "paramCalculateClasses": [
      "reestrEstimateEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "doc.number": {
    "name": "РД",
    "search": true,
    "width": "40",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullLeft ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 24,
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.name": {
    "name": "Наименование",
    "search": true,
    "width": "148",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullLeft ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 25,
    "editAttributes": {
      "reestrStageEdit": {
        "type": "text",
        "options": []
      }
    },
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.state": {
    "name": "Статус",
    "search": true,
    "width": "50",
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullLeft ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 26,
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "delivery.request": {
    "name": "Закупки ИТЭ",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 27,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "delivery.requestMaterial": {
    "name": "Закупки ИТЭ МАТ",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 28,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "delivery.requestEquipment": {
    "name": "Закупки ИТЭ ОБ",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 29,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "delivery.selling": {
    "name": "Закупки заказчик",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 30,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.hasBdrCustomer": {
    "name": "Верхнее выполнение",
    "search": true,
    "width": "40",
    "sortType": "",
    "sortfunc": "",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 31,
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "upSum.estimate": {
    "name": "Потенциальная себестоимость",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 32,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit",
      "reestrEstimateEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "delivery.volume": {
    "name": "Объём.",
    "search": true,
    "width": 50,
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullRight floatInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 32,
    "editAttributes": {
      "reestrLeafStageEdit": {
        "type": "text",
        "options": []
      }
    },
    "paramCalculateClasses": [
      "reestrLeafStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": 3
  },
  "delivery.measure": {
    "name": "Ед изм.",
    "search": true,
    "width": 50,
    "sortType": "",
    "sortfunc": "",
    "classColumn": "assignDataClass ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 33,
    "editAttributes": {
      "reestrLeafStageEdit": {
        "type": "select",
        "options": {
          "value": {
            "1": "шт.",
            "2": "рулон",
            "3": "м",
            "4": "п.м",
            "5": "т",
            "6": "компл.",
            "7": "кг",
            "8": "м2",
            "9": "упак",
            "10": "м3",
            "11": "пары",
            "12": "л",
            "13": "км",
            "14": "Бобина",
            "15": "пар",
            "16": "лист",
            "17": "мешок",
            "18": "тыс.шт.",
            "19": "бухт",
            "20": "бочка",
            "21": "шт./тыс.кВА",
            "22": "пач.",
            "23": "коробка",
            "24": "мл",
            "25": "амп.",
            "": "Ничего не выбрано"
          },
          "default": "",
          "filterCriteria": {
            "assignDataClass": null
          }
        }
      }
    },
    "paramCalculateClasses": [
      "reestrLeafStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "upSum.bdr": {
    "name": "Заказчик.Выполнение",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 33,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "downSum.estimate": {
    "name": "ПО.Cмета",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 34,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit",
      "reestrEstimateEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "delivery.manHour": {
    "name": "чел./час",
    "search": true,
    "width": 50,
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullRight floatInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 34,
    "editAttributes": {
      "reestrLeafStageEdit": {
        "type": "text",
        "options": []
      }
    },
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "delivery.smrPriceOfUnit": {
    "name": "Единичная расценка СМР",
    "search": true,
    "width": 50,
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullLeft ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 35,
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "downEstimate.smr": {
    "name": "ПО СМР",
    "search": true,
    "width": "40",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 35,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit",
      "reestrEstimateEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "delivery.equipmentPriceOfUnit": {
    "name": "Единичная расценка ОБ",
    "search": true,
    "width": 50,
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullLeft ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 36,
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "downEstimate.pnr": {
    "name": "ПО ПНР",
    "search": true,
    "width": "40",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 36,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit",
      "reestrEstimateEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "delivery.otherPriceOfUnit": {
    "name": "Единичная расценка Прочие",
    "search": true,
    "width": 50,
    "sortType": "",
    "sortfunc": "",
    "classColumn": "columnPullLeft ",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 37,
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "downEstimate.equipment": {
    "name": "ПО ОБ",
    "search": true,
    "width": "40",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 37,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit",
      "reestrEstimateEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "downEstimate.pir": {
    "name": "ПО ПИР",
    "search": true,
    "width": "40",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 38,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit",
      "reestrEstimateEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "downEstimate.other": {
    "name": "ПО Прочие",
    "search": true,
    "width": "40",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 39,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit",
      "reestrEstimateEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "downSum.bdr": {
    "name": "ПО.Выполнение",
    "search": true,
    "width": "50",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 40,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit",
      "reestrEstimateEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incomeStage.uid": {
    "name": "UID",
    "search": true,
    "width": "40",
    "sortType": "",
    "sortfunc": "",
    "urlRow": "",
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 41,
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  },
  "incStageSum.limitEquipment": {
    "name": "Лимит ОБ",
    "search": true,
    "width": "35",
    "sortType": "integer",
    "sortfunc": "",
    "classColumn": "columnPullRight moneyInput ",
    "urlRow": "",
    "formatCell": true,
    "excel": true,
    "columnVisible": true,
    "sequenceColumn": 42,
    "paramCalculateColumn": true,
    "paramCalculateName": "default",
    "paramCalculateClasses": [
      "reestrStageEdit"
    ],
    "falseEqValueReplace": false,
    "falseEqValueReplacement": "",
    "editedValuePreparer": null,
    "columnDataType": null,
    "precision": null
  }
}