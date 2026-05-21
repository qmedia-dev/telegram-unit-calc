import './styles/index.css';
import React, { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { useApp } from '../../hooks';
import Form from '../Form/Form';
import Result from '../Result/Result';
import CurrencySelector from '../CurrencySelector/CurrencySelector';

const Fact = () => {
  const { setCalcType, formatPrice, formatNumber } = useApp();

  const [budget, setBudget] = React.useState('');
  const [cpc, setCpc] = React.useState('');
  const [leads, setLeads] = React.useState('');
  const [buyers, setBuyers] = React.useState('');
  const [averageSales, setAverageSales] = React.useState('');
  const [margin, setMargin] = React.useState('');
  const [retention, setRetention] = React.useState('');

  const [groups, setGroups] = React.useState([]);
  const [canCalculate, setCanCalculate] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [currency, setCurrency] = React.useState('BYN');

  useEffect(() => {
    WebApp.BackButton.onClick(() => {
      setCalcType(null);
    });
    WebApp.BackButton.show();
  }, []);

  useEffect(() => {
    setGroups([
      {
        title: 'Параметры рекламной кампании',
        fields: [
          {
            label: '💰 Бюджет (Budget)',
            caption: 'Бюджет рекламной кампании',
            name: 'budget',
            value: budget,
            formattedValue: formatPrice(budget),
            setValue: setBudget,
            unit: currency,
          },
          {
            label: '💸 CPC',
            caption: 'Стоимость перехода на сайт',
            name: 'cpc',
            value: cpc,
            formattedValue: formatPrice(cpc),
            setValue: setCpc,
            unit: currency,
          },
        ],
      },
      {
        title: 'Параметры продаж',
        fields: [
          {
            label: '📩 Количество заявок (Leads)',
            caption: 'Какое количество заявок и обращений вы получили',
            name: 'leads',
            value: leads,
            formattedValue: formatNumber(leads),
            setValue: setLeads,
            unit: 'шт.',
          },
          {
            label: '🛍 Количество клиентов (Buyers)',
            caption: 'Какое было количество реальных продаж',
            name: 'buyers',
            value: buyers,
            formattedValue: formatNumber(buyers),
            setValue: setBuyers,
            unit: 'шт.',
          },
        ],
      },
      {
        title: 'Параметры бизнес модели',
        fields: [
          {
            label: '🛒 Средний чек (Average Sales)',
            caption: 'На какую сумму в среднем покупает один клиент',
            name: 'averageSales',
            value: averageSales,
            formattedValue: formatPrice(averageSales),
            setValue: setAverageSales,
            unit: currency,
          },
          {
            label: '📊 Маржинальность (Margin)',
            caption:
              'Какой % выручки остаётся после продажи товаров (за вычетом себестоимости) или оказания услуг',
            name: 'margin',
            value: margin,
            formattedValue: formatNumber(margin),
            setValue: setMargin,
            unit: '%',
          },
          {
            label: '🔄 Количество покупок на клиента (Retention)',
            caption:
              'Сколько покупок совершает один клиент за весь жизненный цикл. Цель любого бизнеса – удерживать клиента как можно дольше!',
            name: 'retention',
            value: retention,
            formattedValue: formatNumber(retention),
            setValue: setRetention,
            unit: 'шт.',
          },
        ],
      },
    ]);

    setCanCalculate(
      Boolean(
        budget !== ''
          && cpc !== ''
          && leads !== ''
          && buyers !== ''
          && averageSales !== ''
          && margin !== ''
          && retention !== '',
      ),
    );
  }, [budget, cpc, leads, buyers, averageSales, margin, retention, currency]);

  useEffect(() => {
    if (!canCalculate) {
      setResults([]);
      return;
    }

    const ltv = averageSales * (margin / 100) * retention;
    const profitPerCustomer = ltv - budget / buyers;
    const totalProfit = ltv * buyers - budget;
    const porogCpc = (ltv * buyers) / (budget / cpc);
    const porogCpa = (ltv * buyers) / leads;
    const cr1 = (leads / (budget / cpc)) * 100;
    const cr2 = (buyers / leads) * 100;
    const cpa = budget / leads;
    const costPerAquisition = budget / buyers;
    const totalRevenue = buyers * averageSales * retention;
    const firstSaleProfit = averageSales * (margin / 100) - costPerAquisition;

    setResults([
      {
        type: 'main',
        title: '💵 Пороговый CPC',
        caption:
          'Вы можете увеличивать бюджет и охваты, повышая CPC до этого уровня, оставаясь прибыльными',
        value: porogCpc,
        formattedValue: formatPrice(porogCpc),
        unit: currency,
        isInvalid: porogCpc < 0,
      },
      {
        type: 'main',
        title: '🎯 Пороговая стоимость заявки (CPA)',
        caption: 'Максимальная стоимость одной заявки, которую вы можете себе позволить',
        value: porogCpa,
        formattedValue: formatPrice(porogCpa),
        unit: currency,
        isInvalid: porogCpa < 0,
      },
      {
        title: '📈 Конверсия сайта (CR1)',
        caption:
          'Какой % посетителей вашего сайта оставят заказ или свяжутся с вами = на сколько хорош ваш сайт',
        value: cr1,
        formattedValue: formatNumber(cr1),
        unit: '%',
        isInvalid: cr1 < 0,
      },
      {
        title: '💬 Конверсия отдела продаж (CR2)',
        caption:
          'Какой % обращений превращаются в реальные продажи = как хорошо работает ваш отдел продаж',
        value: cr2,
        formattedValue: formatNumber(cr2),
        unit: '%',
        isInvalid: cr2 < 0,
      },
      {
        title: '📉 Стоимость заявки (CPA)',
        caption:
          'Текущая стоимость заявки. Если она ниже порогового значения, то вы прибыльны и обязаны масштабироваться',
        value: cpa,
        formattedValue: formatPrice(cpa),
        unit: currency,
        isInvalid: cpa < 0,
      },
      {
        title: '🏷 Стоимость привлечения клиента (Cost Per Acquisition)',
        caption:
          'Во сколько вам обходится каждый новый клиент. Вы можете снижать её, повышая качество обработки заявок',
        value: costPerAquisition,
        formattedValue: formatPrice(costPerAquisition),
        unit: currency,
        isInvalid: costPerAquisition < 0,
      },
      {
        title: '💰 Выручка с клиента (Average Revenue Per User)',
        caption: 'Сколько платит вам клиент за весь его жизненный цикл',
        value: ltv,
        formattedValue: formatPrice(ltv),
        unit: currency,
        isInvalid: ltv < 0,
      },
      {
        title: '📈 Общая выручка (Total Revenue)',
        caption: 'Для её увеличения есть несколько шагов. Хотите знать каких?',
        value: totalRevenue,
        formattedValue: formatPrice(totalRevenue),
        unit: currency,
        isInvalid: totalRevenue < 0,
      },
      {
        title: '💡 Прибыль с первой продажи (1st Sale Profit)',
        caption: 'Часто, продавая в «минус» первый раз, вы остаётесь прибыльными',
        value: firstSaleProfit,
        formattedValue: formatPrice(firstSaleProfit),
        unit: currency,
        isInvalid: firstSaleProfit < 0,
      },
      {
        title: '🔄 Прибыль с клиента (LTV)',
        caption: 'Ваш чистый заработок с одного клиента за весь его жизненный цикл',
        value: profitPerCustomer,
        formattedValue: formatPrice(profitPerCustomer),
        unit: currency,
        isInvalid: profitPerCustomer < 0,
      },
      {
        title: '📊 Общая прибыль (Total Profit)',
        caption: 'Ваш итоговый финансовый результат',
        value: totalProfit,
        formattedValue: formatPrice(totalProfit),
        unit: currency,
        isInvalid: totalProfit < 0,
      },
    ]);
  }, [budget, cpc, leads, buyers, averageSales, margin, retention, canCalculate, currency]);

  return (
    <>
      <Form>
        <Form.Header>
          <Form.Title>Расчёт по факту</Form.Title>
          <Form.Caption>
            Укажите ваши реальные показатели и увидите экономический результат
          </Form.Caption>
          <CurrencySelector currency={currency} onChange={setCurrency} />
        </Form.Header>
        {groups.map((group, index) => (
          <Form.Group title={group.title} key={index}>
            {group.fields.map((field) => (
              <Form.Field
                key={field.name}
                label={field.label}
                caption={field.caption}
                name={field.name}
                value={field.value}
                setValue={field.setValue}
                unit={field.unit}
              />
            ))}
          </Form.Group>
        ))}
      </Form>

      {results.length !== 0 && <Result groups={groups} results={results} />}
    </>
  );
};

export default Fact;
