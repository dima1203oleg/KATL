'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Waypoints, 
  Zap, 
  ChartNoAxesCombined, 
  Sun, 
  Layers, 
  Network, 
  Building2, 
  Factory, 
  ShieldCheck, 
  ArrowRight,
  BatteryCharging,
  Sliders,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  locale?: string;
}

export function CatlCreativeStudio({ locale = 'uk-UA' }: Props) {
  const isEn = locale === 'en';
  const isZh = locale === 'zh-CN';
  const root = `/${locale}`;

  // Interactive Card States
  const [flowMode, setFlowMode] = useState<'grid' | 'solar' | 'backup'>('grid');
  const [calcPower, setCalcPower] = useState(2);
  const [calcHours, setCalcHours] = useState(4);
  const [peakMode, setPeakMode] = useState<'before' | 'after'>('before');
  const [solarTime, setSolarTime] = useState<'day' | 'evening'>('day');
  const [activeLevel, setActiveLevel] = useState(0);
  const [activePart, setActivePart] = useState(0);
  const [sectorIndex, setSectorIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [upsMode, setUpsMode] = useState<'bess' | 'ups' | 'both'>('bess');
  const [compareModel1, setCompareModel1] = useState('catl-tener-6250');
  const [compareModel2, setCompareModel2] = useState('catl-enerone-plus');

  const levels = [
    { name: isEn ? 'Cell' : isZh ? '电芯' : 'Комірка', desc: isEn ? 'Electrochemical cell (LFP 314Ah / 280Ah) — fundamental building block.' : isZh ? '磷酸铁锂单体电芯 (314Ah / 280Ah)，储能基本单元。' : 'Електрохімічний елемент LFP 314Ah / 280Ah — базова основа.' },
    { name: isEn ? 'Module' : isZh ? '电池模组' : 'Модуль', desc: isEn ? 'Integrated pack of cells with laser-welded busbars and sensor harness.' : isZh ? '带激光焊接母排与温度/电压传感器的电芯模组。' : 'Блок комірок із лазерним зварюванням шин та датчиками NTC.' },
    { name: isEn ? 'Rack' : isZh ? '电池簇 / 机架' : 'Стійка (Rack)', desc: isEn ? 'Series-connected modules up to 1500V DC with high-voltage control box.' : isZh ? '1500V 高压电池簇，包含高压控制箱 (HV Box)。' : 'Послідовно з’єднані модулі до 1500V DC із високовольтним блоком.' },
    { name: isEn ? 'Cabinet' : isZh ? '户外柜' : 'Шафа', desc: isEn ? 'Outdoor liquid-cooled cabinet (e.g. EnerOne Plus 418 kWh).' : isZh ? '户外一体化液冷柜（如 EnerOne Plus 418 kWh）。' : 'Зовнішня шафа з рідинним охолодженням (наприклад EnerOne Plus).' },
    { name: isEn ? 'Container' : isZh ? '集装箱' : 'Контейнер', desc: isEn ? 'Standard 20-ft containerized BESS (e.g. TENER 6.25 MWh).' : isZh ? '标准 20 尺集装箱储能系统（如天恒 TENER 6.25 MWh）。' : 'Стандартний 20-футовий TEU контейнер (наприклад TENER 6.25 МВт·год).' },
    { name: isEn ? 'Plant / Site' : isZh ? '电站 / 园区' : 'Майданчик', desc: isEn ? 'Multi-container utility BESS integrated with substation and SCADA.' : isZh ? '接入变电站与 EMS/SCADA 的多机集装箱储能电站。' : 'Багатоконтейнерний комплекс із підстанцією 10/35 кВ та SCADA.' }
  ];

  const parts = [
    { title: isEn ? 'Battery BESS' : isZh ? '电池系统' : 'Батарея CATL', desc: isEn ? 'Chemical energy storage, high-density LFP cells and BMS hierarchy.' : isZh ? '电化学能量存储核心，高能量密度 LFP 电芯与三级 BMS。' : 'Накопичувач енергії, LFP осередки 314Ah та багаторівнева BMS.' },
    { title: isEn ? 'PCS Inverter' : isZh ? '变流器 (PCS)' : 'PCS інвертор', desc: isEn ? 'Bi-directional AC/DC power conversion system (1500V to 0.69kV).' : isZh ? '双向交直流变流器 (1500V DC 转 0.69kV AC)。' : 'Двонаправлений перетворювач AC/DC (1500V DC у 0.69kV AC).' },
    { title: isEn ? 'Smart EMS' : isZh ? '能量管理 EMS' : 'Smart EMS / SCADA', desc: isEn ? 'Algorithm-driven peak shaving, arbitrage, frequency response.' : isZh ? '削峰填谷算法、电价套利调度与电网一次调频接口。' : 'Алгоритмічне зрізання піків, арбітраж та балансування мережі.' },
    { title: isEn ? 'Switchgear & MV' : isZh ? '高压开关与保护' : 'РУ 10(35) кВ та РЗА', desc: isEn ? 'Step-up transformer, circuit breakers, surge protection and ASKOE.' : isZh ? '升压变压器、真空断路器、微机继电保护与商业计量。' : 'Трансформатор, вакуумні вимикачі, захисти РЗА та облік АСКОЕ.' }
  ];

  const sectors = [
    { id: 'manufacturing', name: isEn ? 'Manufacturing' : isZh ? '制造业' : 'Виробництво', slug: 'manufacturing', img: '/design/solution-industry.webp' },
    { id: 'agriculture', name: isEn ? 'Agriculture' : isZh ? '农业粮食' : 'Агросектор', slug: 'agriculture', img: '/design/solution-solar.webp' },
    { id: 'logistics', name: isEn ? 'Logistics' : isZh ? '仓储物流' : 'Логістика', slug: 'logistics', img: '/design/solution-backup.webp' },
    { id: 'ev-charging', name: isEn ? 'EV Hubs' : isZh ? '充电桩场站' : 'Зарядні хаби', slug: 'ev-charging', img: '/design/solution-charging.webp' },
    { id: 'data-centres', name: isEn ? 'Data Centers' : isZh ? '数据中心' : 'Дата-центри', slug: 'data-centres', img: '/design/solution-data.webp' }
  ];

  const steps = [
    { num: '01', title: isEn ? 'Requirements' : isZh ? '需求勘测' : 'Вимоги', desc: isEn ? 'Load profile, peak consumption, grid connection limits and target goals.' : isZh ? '用电负荷曲线、峰值功率、变压器容量限制与储能目标。' : 'Профіль споживання, пікові навантаження, ліміт приєднання та цілі.' },
    { num: '02', title: isEn ? 'Metering' : isZh ? '实测计量' : 'Вимірювання', desc: isEn ? '15-minute interval logging, power quality harmonics, and reactive demand.' : isZh ? '15分钟采样负荷数据记录、电能质量谐波与无功功率监测。' : '15-хвилинні погодинні графіки, гармоніки та коефіцієнт реактиву.' },
    { num: '03', title: isEn ? 'Engineering Sizing' : isZh ? '方案选型' : 'Підбір обладнання', desc: isEn ? 'Sizing CATL models (TENER/EnerOne), C-rate, duration, degradation margin.' : isZh ? '匹配 CATL 最佳型号（天恒/EnerOne）、倍率、放电深度与衰减裕量。' : 'Вибір CATL моделей (TENER / EnerOne), C-rate, буфер деградації.' },
    { num: '04', title: isEn ? 'Design Stage P' : isZh ? '工程设计' : 'Проєктування', desc: isEn ? 'Single-line diagrams, relay coordination, fire safety NFPA/DSTU compliance.' : isZh ? '编制电气主接线图、继电保护定值计算及消防安全设计方案。' : 'Стадія «П», однолінійна схема (SLD), пожежний розділ та РЗА.' },
    { num: '05', title: isEn ? 'Installation' : isZh ? '现场施工' : 'Монтаж', desc: isEn ? 'Civil foundation, crane placement, DC cabling, MV transformer tie-in.' : isZh ? '基础承重浇筑、集装箱吊装定位、直流布线与高压变压器接火。' : 'Фундаментна плита, такелаж TEU, кабельне поле та силове підключення.' },
    { num: '06', title: isEn ? 'Commissioning' : isZh ? '并网投运' : 'Запуск і ПНР', desc: isEn ? 'BMS calibration, SCADA integration, safety testing and DSO energization.' : isZh ? 'BMS 均衡标定、调度 SCADA 通信调试、安全联锁试验与并网送电。' : 'Калібрування BMS, SCADA диспетчеризація, тести захистів та пуск.' }
  ];

  const scenarios = [
    { 
      name: isEn ? 'Peak Demand Shaving' : isZh ? '变压器容量需量管理 (削峰)' : 'Зрізання пікової потужності', 
      checklist: isEn 
        ? ['15-minute load demand history', 'Contractual peak capacity tariff', 'Frequency and duration of peak spikes']
        : isZh 
        ? ['15 分钟间隔历史负荷数据', '需量电价及容量超限罚款标准', '尖峰负荷持续时间与日频次']
        : ['15-хвилинні інтервальні графіки споживання', 'Тариф на приєднану потужність / переліміт', 'Тривалість і повторюваність піків']
    },
    { 
      name: isEn ? 'Emergency Backup Resilience' : isZh ? '重要负荷应急保电 (UPS 备电)' : 'Резервне живлення підприємства', 
      checklist: isEn 
        ? ['Continuous power of critical loads (kW)', 'Required autonomy duration (2h / 4h / 8h)', 'Automatic Transfer Switch (ATS) reaction time']
        : isZh 
        ? ['一级重要用电负荷容量 (kW)', '要求后备续航时间 (2h / 4h / 8h)', '双电源自动切换 (ATS) 切换时限']
        : ['Потужність критичної групи (кВт)', 'Потрібний час автономної роботи (2–8 год)', 'Час перемикання АВР на вводі']
    },
    { 
      name: isEn ? 'Solar PV Self-Consumption' : isZh ? '光伏配储自发自用' : 'СЕС + максимальне самоспоживання', 
      checklist: isEn 
        ? ['Installed PV capacity (MWp)', 'Export limitation / zero feed-in rule', 'Evening and night load demand curve']
        : isZh 
        ? ['光伏电站装机峰值容量 (MWp)', '反孤岛或防逆流上网限制条件', '日落后晚间厂区负荷曲线']
        : ['Встановлена потужність СЕС (МВт)', 'Обмеження генерації в мережу', 'Вечірній графік споживання об’єкта']
    }
  ];

  return (
    <section className="container creative-studio">
      <div className="creative-studio-heading">
        <div>
          <span className="energy-kicker">
            {isEn ? 'INTERACTIVE ENGINEERING GUIDE · ESS / BESS' : isZh ? '储能工程实战指南 · ESS / BESS' : 'ІНТЕРАКТИВНИЙ ГІД · ESS / BESS'}
          </span>
          <h2>
            {isEn ? 'How Energy Storage Works: Interactive Models' : isZh ? '储能系统运行原理：工程模型演示' : 'Як працює накопичення — інтерактивні моделі'}
          </h2>
          <p>
            {isEn 
              ? 'Explore power flow dynamics, MW vs MWh sizing, peak shaving mechanisms, and complete turnkey project roadmaps.'
              : isZh 
              ? '深入了解储能能量流向控制、MW 与 MWh 的工程差异、削峰填谷数学模型及从勘测到并网的完整项目实施路径。'
              : 'Дослідіть потік енергії, різницю між потужністю та ємністю, алгоритми зрізання піків та покроковий шлях реалізації проєкту.'}
          </p>
        </div>
        <span className="creative-demo-pill">
          <span className="pulse-dot"></span> 
          {isEn ? 'Interactive Visual Sizing' : isZh ? '实时交互工程模型' : 'Інженерна візуалізація'}
        </span>
      </div>

      <div className="creative-grid">
        {/* Card 1: Energy Flow */}
        <article className="creative-card">
          <header>
            <span className="creative-index">01</span>
            <span className="creative-icon"><Waypoints size={19} /></span>
            <div>
              <h3>{isEn ? 'Power Flow: Grid ↔ BESS ↔ Facility' : isZh ? '能量流向：电网 ↔ 储能 ↔ 负荷' : 'Мережа ↔ BESS ↔ Об’єкт'}</h3>
              <p>{isEn ? 'Switch operational modes to observe dynamic battery interaction.' : isZh ? '切换工作模式，查看储能与电网的协同关系。' : 'Перемкніть режим, щоб побачити напрямок перетоку потужності.'}</p>
            </div>
          </header>
          <div className="creative-card-content">
            <div className="creative-toggle">
              <button 
                type="button" 
                className={flowMode === 'grid' ? 'is-active' : ''}
                onClick={() => setFlowMode('grid')}
              >
                {isEn ? 'Grid Charge' : isZh ? '谷电充储' : 'Заряд від мережі'}
              </button>
              <button 
                type="button" 
                className={flowMode === 'solar' ? 'is-active' : ''}
                onClick={() => setFlowMode('solar')}
              >
                {isEn ? 'Solar Storage' : isZh ? '光伏消纳' : 'Сонячна генерація'}
              </button>
              <button 
                type="button" 
                className={flowMode === 'backup' ? 'is-active' : ''}
                onClick={() => setFlowMode('backup')}
              >
                {isEn ? 'Blackout Islanding' : isZh ? '离网孤岛' : 'Резервний режим'}
              </button>
            </div>
            
            <div className="creative-flow">
              <span className="flow-node">
                {flowMode === 'solar' ? (isEn ? 'Solar PV' : isZh ? '光伏阵列' : 'СЕС') : (isEn ? 'Grid 10kV' : isZh ? '10kV 电网' : 'Мережа')}
              </span>
              <span className="flow-arrow">➔</span>
              <span className="flow-node highlight">
                <BatteryCharging size={18} />
                <b>CATL BESS</b>
              </span>
              <span className="flow-arrow">➔</span>
              <span className="flow-node">
                {flowMode === 'backup' ? (isEn ? 'Critical Loads' : isZh ? '一级负荷' : 'Критичні споживачі') : (isEn ? 'Facility' : isZh ? '工厂用电' : 'Об’єкт')}
              </span>
            </div>
            <p className="creative-note">
              {flowMode === 'backup' 
                ? (isEn ? 'Islanding speed <20ms requires dedicated microgrid controller & PCS with grid-forming capability.' : isZh ? '微秒级离网切换依赖具备构网型 (Grid-Forming) 功能的双向 PCS。' : 'Перехід в автономний острів <20мс вимагає PCS із функцією Grid-Forming.')
                : flowMode === 'solar'
                ? (isEn ? 'Surplus solar energy is captured directly into DC-coupled or AC-coupled battery arrays.' : isZh ? '午间盈余光伏电能直接充入电池组，避免弃光。' : 'Надлишок сонячної енергії накопичується в батареї, усуваючи скидання генерації.')
                : (isEn ? 'Scheduled charging during off-peak night tariff with discharge at peak daytime hours.' : isZh ? '夜间谷段低电价充电，白天尖峰时段放电套利。' : 'Нічний заряд за мінімальним тарифом та розряд у пікові денні години.')}
            </p>
          </div>
        </article>

        {/* Card 2: MW vs MWh */}
        <article className="creative-card">
          <header>
            <span className="creative-index">02</span>
            <span className="creative-icon"><Zap size={19} /></span>
            <div>
              <h3>{isEn ? 'Power (MW) vs Capacity (MWh)' : isZh ? '功率 (MW) 与 容量 (MWh) 的区别' : 'Потужність (МВт) та Ємність (МВт·год)'}</h3>
              <p>{isEn ? 'Power defines speed of supply; Capacity defines total energy stored.' : isZh ? '功率决定供电瞬时速度，容量决定后备持续时长。' : 'Потужність визначає швидкість подачі, ємність — загальну кількість енергії.'}</p>
            </div>
          </header>
          <div className="creative-card-content">
            <div className="creative-sliders">
              <label>
                <span>{isEn ? 'Inverter Power:' : isZh ? 'PCS 额定功率：' : 'Потужність PCS:'} <b>{calcPower} MW</b></span>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1" 
                  value={calcPower}
                  onChange={(e) => setCalcPower(Number(e.target.value))}
                />
              </label>
              <label>
                <span>{isEn ? 'Discharge Duration:' : isZh ? '持续放电时间：' : 'Тривалість розряду:'} <b>{calcHours} {isEn ? 'hrs' : isZh ? '小时' : 'год'}</b></span>
                <input 
                  type="range" 
                  min="1" 
                  max="8" 
                  step="1" 
                  value={calcHours}
                  onChange={(e) => setCalcHours(Number(e.target.value))}
                />
              </label>
            </div>
            <div className="creative-result">
              <small>{isEn ? 'Required Energy Storage (0.5C...1C)' : isZh ? '测算电能量' : 'Необхідна ємність BESS:'}</small>
              <strong>{(calcPower * calcHours).toFixed(1)} MWh</strong>
              <span>{Math.ceil((calcPower * calcHours) / 6.25)} × CATL TENER (6.25 MWh)</span>
            </div>
            <p className="creative-note">
              {isEn 
                ? 'Accounts for recommended 10% Depth-of-Discharge (DoD) margin and 88% AC-AC RTE efficiency.'
                : isZh 
                ? '建议在实际方案中预留 10% 放电深度 (DoD) 衰减裕度与 88% 往返转换效率。'
                : 'Враховуйте 10% буфер глибини розряду (DoD) та 88% ККД повного циклу (RTE).'}
            </p>
          </div>
        </article>

        {/* Card 3: Peak Shaving */}
        <article className="creative-card">
          <header>
            <span className="creative-index">03</span>
            <span className="creative-icon"><ChartNoAxesCombined size={19} /></span>
            <div>
              <h3>{isEn ? 'Peak Shaving Mechanics' : isZh ? '需量管理与削峰填谷原理' : 'Принцип зрізання піків (Peak Shaving)'}</h3>
              <p>{isEn ? 'BESS discharges automatically when demand exceeds contract transformer limit.' : isZh ? '当工厂负荷超过变压器合同容量时，储能毫秒级放电补足差额。' : 'BESS миттєво підхоплює навантаження, коли потужність перевищує договірний ліміт.'}</p>
            </div>
          </header>
          <div className="creative-card-content">
            <div className="creative-toggle">
              <button 
                type="button" 
                className={peakMode === 'before' ? 'is-active' : ''}
                onClick={() => setPeakMode('before')}
              >
                {isEn ? 'Without BESS (High Peaks)' : isZh ? '无储能（峰值超限）' : 'Без BESS (Переліміт)'}
              </button>
              <button 
                type="button" 
                className={peakMode === 'after' ? 'is-active' : ''}
                onClick={() => setPeakMode('after')}
              >
                {isEn ? 'With BESS Active' : isZh ? '启用储能削峰' : 'З BESS (Зрізаний пік)'}
              </button>
            </div>
            <div className="peak-chart-wrap">
              <svg className="creative-chart" viewBox="0 0 310 90" role="img" aria-label="Peak shaving curve">
                <line x1="10" y1="35" x2="300" y2="35" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="14" y="30" fill="#ef4444" fontSize="9" fontWeight="700">
                  {isEn ? 'GRID LIMIT (1.5 MW)' : isZh ? '变压器容量红线 (1.5 MW)' : 'ЛІМІТ ПРИЄДНАННЯ (1.5 МВт)'}
                </text>
                {peakMode === 'before' ? (
                  <polyline 
                    points="10,80 40,75 70,60 100,18 130,22 160,55 190,75 220,15 250,25 280,70 300,75" 
                    fill="none" 
                    stroke="#f97316" 
                    strokeWidth="2.5" 
                  />
                ) : (
                  <>
                    <polyline 
                      points="10,80 40,75 70,60 100,35 130,35 160,55 190,75 220,35 250,35 280,70 300,75" 
                      fill="none" 
                      stroke="#0066ff" 
                      strokeWidth="2.5" 
                    />
                    <polygon 
                      points="100,35 100,18 130,22 130,35" 
                      fill="#0066ff33" 
                    />
                    <polygon 
                      points="220,35 220,15 250,25 250,35" 
                      fill="#0066ff33" 
                    />
                  </>
                )}
              </svg>
            </div>
            <p className="creative-note">
              {peakMode === 'before' 
                ? (isEn ? 'Red line exceeded — heavy penalties from grid operator for capacity overages.' : isZh ? '负荷尖峰刺穿红线，导致高额容量需量罚款或断路器跳闸。' : 'Перевищення червоної лінії веде до значних штрафів оператора системи або спрацювання вводів.')
                : (isEn ? 'Blue shaded area covered by CATL BESS — demand kept precisely below contractual limit.' : isZh ? '蓝色阴影部分由 CATL 储能毫秒级放电填补，负荷完美被约束在安全线以内。' : 'Синє поле покривається розрядом BESS — споживання суворо в межах ліміту без штрафів.')}
            </p>
          </div>
        </article>

        {/* Card 4: Cell to Grid Hierarchy */}
        <article className="creative-card">
          <header>
            <span className="creative-index">04</span>
            <span className="creative-icon"><Layers size={19} /></span>
            <div>
              <h3>{isEn ? 'Hierarchy: From Cell to Utility Site' : isZh ? '层级架构：从电芯到电网级电站' : 'Ієрархія: від осередку до майданчика'}</h3>
              <p>{isEn ? 'Understand how individual CATL cells build up into mega-scale plants.' : isZh ? '点击查看从单个 LFP 电芯到百万千瓦时电站的层级组成。' : 'Дізнайтеся, як осередки об’єднуються в контейнерний енергопарк.'}</p>
            </div>
          </header>
          <div className="creative-card-content">
            <div className="creative-levels">
              {levels.map((lvl, idx) => (
                <button
                  key={lvl.name}
                  type="button"
                  className={activeLevel === idx ? 'is-active' : ''}
                  onClick={() => setActiveLevel(idx)}
                >
                  {lvl.name}
                </button>
              ))}
            </div>
            <div className="creative-selected">
              <b>{levels[activeLevel].name}</b>
              <p>{levels[activeLevel].desc}</p>
            </div>
            <p className="creative-note">
              {isEn ? 'Warranty scope and cycle terms are defined in the manufacturer documentation for each project.' : isZh ? '质保范围与循环条款以每个项目的制造商文件为准。' : 'Обсяг гарантії та циклові умови визначаються документацією виробника для конкретного проєкту.'}
            </p>
          </div>
        </article>

        {/* Card 5: Core Components of BESS */}
        <article className="creative-card">
          <header>
            <span className="creative-index">05</span>
            <span className="creative-icon"><Network size={19} /></span>
            <div>
              <h3>{isEn ? 'Four Pillars of a Turnkey BESS' : isZh ? '交钥匙储能电站四大核心子系统' : '4 ключові компоненти BESS проєкту'}</h3>
              <p>{isEn ? 'Battery, PCS, EMS and Switchgear operating as one synchronized system.' : isZh ? '电池、变流器、能量管理与高压电气设备紧密协同。' : 'Батарея, інвертор, керування та трансформатор у єдиній системі.'}</p>
            </div>
          </header>
          <div className="creative-card-content">
            <div className="creative-parts">
              {parts.map((p, idx) => (
                <button
                  key={p.title}
                  type="button"
                  className={activePart === idx ? 'is-active' : ''}
                  onClick={() => setActivePart(idx)}
                >
                  {p.title}
                </button>
              ))}
            </div>
            <div className="creative-selected">
              <b>{parts[activePart].title}</b>
              <p>{parts[activePart].desc}</p>
            </div>
            <p className="creative-note">
              {isEn ? 'Applicable certificates (e.g. IEC 62619, UL 9540A) are checked per specific product and project.' : isZh ? '适用认证（如 IEC 62619、UL 9540A）按具体产品与项目核验。' : 'Застосовні сертифікати (напр. IEC 62619, UL 9540A) перевіряються для конкретного продукту й проєкту.'}
            </p>
          </div>
        </article>

        {/* Card 6: Project Roadmap */}
        <article className="creative-card">
          <header>
            <span className="creative-index">06</span>
            <span className="creative-icon"><Factory size={19} /></span>
            <div>
              <h3>{isEn ? 'Project Delivery Roadmap' : isZh ? '储能工程全生命周期实施阶段' : 'Шлях реалізації BESS під ключ'}</h3>
              <p>{isEn ? 'Step-by-step from initial audit to grid commissioning.' : isZh ? '从前期负荷审计到最终调度受电投运的六大阶段。' : '6 етапів: від первинного енергоаудиту до пуску в роботу.'}</p>
            </div>
          </header>
          <div className="creative-card-content">
            <div className="creative-steps">
              {steps.map((st, idx) => (
                <button
                  key={st.num}
                  type="button"
                  className={stepIndex === idx ? 'is-active' : ''}
                  onClick={() => setStepIndex(idx)}
                >
                  <b>{st.num}</b>
                  <span>{st.title}</span>
                </button>
              ))}
            </div>
            <div className="creative-selected">
              <b>{steps[stepIndex].num} · {steps[stepIndex].title}</b>
              <p>{steps[stepIndex].desc}</p>
            </div>
            <Link href={`${root}/rfq`} className="creative-link">
              <span>{isEn ? 'Start Engineering Inquiry' : isZh ? '开启方案对接' : 'Подати заявку на проєкт'}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
