export async function fetchContMainReestrData() {
  const payload = {
    _search: false,
    nd: 1763678658674,
    rows: 1000000,
    page: 1,
    sidx: '',
    sord: 'asc',
    'income-budget-bundle_reestr_income-budget_income-budget-reestr': {
      ProjectContractType: {
        project: 40,
        ContractType: {
          srcContract: 2453,
        },
      },
      reestr_type: 'income-budget-bundle_reestr_income-budget_income-budget-reestr',
      _token: 'lJKsyEM2CgwlSS6P5g16538ArnUWaX2URwcloYhz9iE',
    },
    context: 'income-budget-bundle_reestr_income-budget_income-budget-reestr',
    reestrMode: 'main',
  };

  const headers = {
    "Content-Type": "application/json",
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // "Cookie": "PHPSESSID=mo8klh88f3tgmm5hn9mejc77aa; BEARER=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQwMjY5MTUsImV4cCI6MTc2NDYyNjkxNSwicGF5bG9hZCI6InRlc3QifQ.MvM_naUsVR_hJlR8y8Ngra6pswHZWOyur7_R9Woizha9-ZsxI2J9GuHP1EoEVnNans7IyHzb0ORiKg_UgxxKkaTSNW-eYehvOzssVIN2xUijQJTbp_g5859omLTRvTTxj4JrMgHh0MGLgpX--Xnh-Re__qXrgEpHOUNUZwhngq_06JfVLxG0ZsTbmBuO-2ujAY65hyc_V5jbB6GTY320JSKMU6lSZqAb3CXwqSRZoBS8xOfupazWsPnXJmZgRDg-tjeo50lqJltWL4wywvUbwXdniOZ0CTKT7xX9DkJGzpaV6jFIv-NP6KVbaT8WZkLwrJWtvR9kAcKJHEsYbzGh7PdsCcuucOOQz5YJ12jqcMT6sb_BDfxy7TCELm-C5sVAEUxC501XOmL28b5sKsf31GkNa8PniDf3Q_i5pQ6aPtGWx7C30Wd0m6qV1eyGXdrF65lN0-zun_RrjCWXIJG3Hp_YCOw0hmoczh9CekhyOhL6eO42FsJ-JYS-bJcMwthBTLR9SNPq0B467XTmscxmK-tjBMOc96fj_qlO-gu3MXrS_bg07nLlVZXxFgjjeFoOLtnWHo0cIHPyESU2aA7o9LAUE8Nrl0Ig7a8DJ00bd14q0KGOyJUfwGxD97TBUsVx7tCAEiPJOuzDqKSPqQka4PIZKVZuUQy9Xa5WFImVP4U; REFRESH=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQwMjY5MTUsImV4cCI6MTc2NDA2MjkxNSwicGF5bG9hZCI6InRlc3QifQ.Fp_1rZ5VOfapHHeSmyT9zCowI3gO1tmHVdKXGhde9t2D3sHz5IFmPZcjVa3XLfIgIp7EvCVnTb6slmWAGpGJOnrx_hlXAmstHt_Jph78bAiOV2DezW7a5LtplT6LzY4uyVAi_MOUabTAFCRNwS_Kr8lK-qicChpdipyO8X5tXJizVpbMMkAM-l8HuoDc1jZAAkITuzna793jl8aDOr2GtmV_coJ__Zqe_OOvYl6R9v_pMaQ8MqtA3P942B3esDUYSJF1YTe0rH9JrYKBmXSvKqt0Ye22zn0x-vUAchYFbIuhVj7j5JnA62VRu5R0gZY_bdo1-q3qZmOlXIk16I6iwk_fy4eZj0Q6w5Vfpjx2NOdLngMVgsM1Iwfd7hsQ4F_0Wrq3kVYWSxh4wg5QSHHBlLNpIZHBwKC1VqahhaNQ7gWDr6C7MvGg0Z_lWkSNghoQJ-FbWlVIIhMKC8cH5kR06VMtm-vF6euE-QN2QVP0A-RjXWO52h6mua1JOq6bj-bCmdDtz2jcDzxIQe57ysuf-wN5wK9LYMOb8xUoZNG4fWXR1p2APs_nVifiEIkz3-9GXhWk5U-wFTO7Pt-jDhy9f07c5ukNCihrVIzZhqVFDATpwQb9mM5OZq4Aea1_mBarQhCwhSQ3Vb3XxYzkQCe4-gskcNeAQ8F8_UJavyKs4vc",
    "Cookie": "PHPSESSID=mo8klh88f3tgmm5hn9mejc77aa; BEARER=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQwMjY5MTUsImV4cCI6MTc2NDYyNjkxNSwicGF5bG9hZCI6InRlc3QifQ.MvM_naUsVR_hJlR8y8Ngra6pswHZWOyur7_R9Woizha9-ZsxI2J9GuHP1EoEVnNans7IyHzb0ORiKg_UgxxKkaTSNW-eYehvOzssVIN2xUijQJTbp_g5859omLTRvTTxj4JrMgHh0MGLgpX--Xnh-Re__qXrgEpHOUNUZwhngq_06JfVLxG0ZsTbmBuO-2ujAY65hyc_V5jbB6GTY320JSKMU6lSZqAb3CXwqSRZoBS8xOfupazWsPnXJmZgRDg-tjeo50lqJltWL4wywvUbwXdniOZ0CTKT7xX9DkJGzpaV6jFIv-NP6KVbaT8WZkLwrJWtvR9kAcKJHEsYbzGh7PdsCcuucOOQz5YJ12jqcMT6sb_BDfxy7TCELm-C5sVAEUxC501XOmL28b5sKsf31GkNa8PniDf3Q_i5pQ6aPtGWx7C30Wd0m6qV1eyGXdrF65lN0-zun_RrjCWXIJG3Hp_YCOw0hmoczh9CekhyOhL6eO42FsJ-JYS-bJcMwthBTLR9SNPq0B467XTmscxmK-tjBMOc96fj_qlO-gu3MXrS_bg07nLlVZXxFgjjeFoOLtnWHo0cIHPyESU2aA7o9LAUE8Nrl0Ig7a8DJ00bd14q0KGOyJUfwGxD97TBUsVx7tCAEiPJOuzDqKSPqQka4PIZKVZuUQy9Xa5WFImVP4U; REFRESH=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQwMjY5MTUsImV4cCI6MTc2NDA2MjkxNSwicGF5bG9hZCI6InRlc3QifQ.Fp_1rZ5VOfapHHeSmyT9zCowI3gO1tmHVdKXGhde9t2D3sHz5IFmPZcjVa3XLfIgIp7EvCVnTb6slmWAGpGJOnrx_hlXAmstHt_Jph78bAiOV2DezW7a5LtplT6LzY4uyVAi_MOUabTAFCRNwS_Kr8lK-qicChpdipyO8X5tXJizVpbMMkAM-l8HuoDc1jZAAkITuzna793jl8aDOr2GtmV_coJ__Zqe_OOvYl6R9v_pMaQ8MqtA3P942B3esDUYSJF1YTe0rH9JrYKBmXSvKqt0Ye22zn0x-vUAchYFbIuhVj7j5JnA62VRu5R0gZY_bdo1-q3qZmOlXIk16I6iwk_fy4eZj0Q6w5Vfpjx2NOdLngMVgsM1Iwfd7hsQ4F_0Wrq3kVYWSxh4wg5QSHHBlLNpIZHBwKC1VqahhaNQ7gWDr6C7MvGg0Z_lWkSNghoQJ-FbWlVIIhMKC8cH5kR06VMtm-vF6euE-QN2QVP0A-RjXWO52h6mua1JOq6bj-bCmdDtz2jcDzxIQe57ysuf-wN5wK9LYMOb8xUoZNG4fWXR1p2APs_nVifiEIkz3-9GXhWk5U-wFTO7Pt-jDhy9f07c5ukNCihrVIzZhqVFDATpwQb9mM5OZq4Aea1_mBarQhCwhSQ3Vb3XxYzkQCe4-gskcNeAQ8F8_UJavyKs4vc",
  };

  const p1 = await fetch(
    'http://php74.cont.prod/reestr/data/income-budget-bundle_reestr_income-budget_income-budget-reestr', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  }
  );

  return await p1.json()
}
