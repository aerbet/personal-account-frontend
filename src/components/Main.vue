<template>
  <div class="lk">
    
      <div class="headerShell">
        <div class="container">
          <header class="topbar">
            <div class="brand">
              <div class="logo" aria-hidden="true"></div>
              <div class="brandTitle">Личный кабинет</div>
            </div>

            <div class="topRight">
              <div class="contract">{{ contractNumber }}</div>
              <button class="logout" type="button" @click="onLogout">
                <font-awesome-icon icon="right-from-bracket" class="logoutFa" />
                Выход
              </button>
            </div>
          </header>
        </div>
      </div>
      <div class="headerShell">
        <div class="container">
          <nav class="tabs" aria-label="Навигация">
            <button
              v-for="t in tabs"
              :key="t.key"
              type="button"
              class="tab"
              :class="{ active: activeTab === t.key }"
              @click="activeTab = t.key"
            >
              <font-awesome-icon :icon="t.icon" class="tabFa" />
              <span class="tabText">{{ t.label }}</span>
            </button>
          </nav>
        </div>
      </div>
  
    <div class="container">
      <main class="content">
        <section class="gridTop">
          <article class="card balance">
            <div class="cardHead cardHead--balance">
              <div class="iconBox iconBox--purple" aria-hidden="true">
                <font-awesome-icon icon="wallet" class="icon"/>
              </div>
              <div class="cardHeadTitle cardHeadTitle--balance">Баланс</div>
            </div>

            <div class="balanceValue">
              {{ balance }} <span class="som">⃀</span>
            </div>
            <div class="balanceHint">Доступно для использования</div>
          </article>

          <article class="card">
            <div class="cardHead">
              <div class="iconBox iconBox--green" aria-hidden="true">
                <font-awesome-icon icon="bolt" class="icon"/>
              </div>
              <div class="cardHeadTitle">Тарифный план</div>
            </div>

            <div class="tariffTitle">{{ tariff.name }}</div>
            <div class="cardContentSub">Действует до {{ tariff.until }}</div>

            <button class="btn" type="button" @click="onChangeTariff">
              Изменить тариф
            </button>
          </article>

          <article class="card">
            <div class="cardHead">
              <div class="iconBox iconBox--orange" aria-hidden="true">
                <font-awesome-icon icon="info-circle" class="icon"/>
              </div>
              <div class="cardHeadTitle">Активные заявки</div>
            </div>

            <div class="ticketsCount">{{ activeTicketsCount }}</div>
            <div class="cardContentSub">Требуют внимания</div>

            <button class="btn" type="button" @click="activeTab = 'tickets'">
              Перейти в поддержку
            </button>
          </article>
        </section>

        <section class="card sectionCard">
          <div class="sectionHead">
            <h2 class="sectionTitle">Подключенные услуги</h2>
            <button class="linkBtn" type="button" @click="onAllServices">
              Все услуги <span aria-hidden="true">→</span>
            </button>
          </div>

          <div class="services">
            <div v-for="s in services" :key="s.id" class="serviceRow">
              <div class="serviceText">
                <div class="serviceName">{{ s.title }}</div>
                <div class="serviceDesc">{{ s.desc }}</div>
              </div>

              <label class="switch">
                <input type="checkbox" v-model="s.enabled" />
                <span class="slider" aria-hidden="true"></span>
              </label>
            </div>
          </div>
        </section>

        <section class="card sectionCard">
          <div class="sectionHead">
            <h2 class="sectionTitle">Поддержка</h2>

            <button class="btnPrimary" type="button" @click="onCreateTicket">
              <span class="plus" aria-hidden="true">+</span>
              Подать заявку
            </button>
          </div>

          <div class="tickets">
            <div v-for="t in tickets" :key="t.id" class="ticketRow">
              <div class="ticketInfo">
                <div class="ticketTitle">{{ t.title }}</div>
                <div class="ticketDate">Создана: {{ t.createdAt }}</div>
              </div>

              <span class="status" :class="statusClass(t.status)">
                {{ statusText(t.status) }}
              </span>
            </div>
          </div>
        </section>

        <section class="card sectionCard">
          <div class="sectionHead">
            <h2 class="sectionTitle">Последние транзакции</h2>
          </div>

          <div class="table">
            <div class="row head">
              <div class="cell">Дата</div>
              <div class="cell">Описание</div>
              <div class="cell right">Сумма</div>
            </div>

            <div v-for="tr in transactions" :key="tr.id" class="row">
              <div class="cell">{{ tr.date }}</div>
              <div class="cell">{{ tr.desc }}</div>
              <div class="cell right" :class="tr.amount > 0 ? 'pos' : 'neg'">
                {{ tr.amount > 0 ? `+${tr.amount}` : tr.amount }} ₽
              </div>
            </div>
          </div>

          <button class="linkCenter" type="button" @click="onDetails">
            Вся детализация расходов
          </button>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      contractNumber: "3211313133213",
      tabs: [
        { key: "home", label: "Главная", icon: ['far', 'house'] },
        { key: "services", label: "Услуги", icon: "sliders" },
        { key: "tickets", label: "Заявки", icon: "file-lines" },
        { key: "details", label: "Детализация", icon: "dollar-sign" },
        { key: "settings", label: "Настройки", icon: "gear" },
      ],
      activeTab: "home",

      balance: 451,
      tariff: { name: "Безлимит PRO", until: "15.12.2023" },
      activeTicketsCount: 2,

      services: [
        { id: 1, title: "Интернет 100 Мбит", desc: "Базовый доступ", enabled: true },
        { id: 2, title: "Мобильный интернет", desc: "20 ГБ в месяц", enabled: true },
      ],

      tickets: [
        { id: 1, title: "Проблема с интернетом", createdAt: "2026-01-10", status: "open" },
        { id: 2, title: "Вопрос по тарифу", createdAt: "2026-01-08", status: "in_progress" },
      ],

      transactions: [
        { id: 1, date: "15.01.2026", desc: "Пополнение баланса", amount: 500 },
        { id: 2, date: "13.01.2026", desc: "Списание за тариф", amount: -500 },
        { id: 3, date: "13.01.2026", desc: "Облачное хранилище", amount: -100 },
        { id: 4, date: "10.01.2026", desc: "Доп. пакет интернета", amount: -150 },
      ],
    };
  },
  methods: {
    statusText(s) {
      if (s === "open") return "Открыта";
      if (s === "in_progress") return "В обработке";
      return "Закрыта";
    },
    statusClass(s) {
      if (s === "open") return "stOpen";
      if (s === "in_progress") return "stProgress";
      return "stClosed";
    },

    onLogout() {
      this.$route("/");
    },
    onChangeTariff() {
      alert("Изменить тариф (заглушка)");
    },
    onAllServices() {
      this.activeTab = "services";
    },
    onCreateTicket() {
      alert("Создать заявку (заглушка)");
    },
    onDetails() {
      this.activeTab = "details";
    },
  },
};
</script>

<style scoped>
.lk {
  min-height: 100vh;
  background: #f5f7fb;
  color: #0f172a;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

.topbar {
  height: 64px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #2563eb;
}
.brandTitle {
  font-weight: 600;
  font-size: 18px;
}

.topRight {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #475569;
}
.contract {
  font-size: 13px;
}
.logout {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: #0f172a;
}
.logoutIcon {
  font-size: 14px;
}

.headerShell {
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e6eaf2;
}

.tabs {
  background: #ffffff;
  display: flex;
  justify-content: left;
  gap: 7px;
  padding: 0 16px;
}
.tab {
  border: none;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 18px;
  border-radius: 10px;
  color: #475569;
  font-weight: 600;
  position: relative;
}

.tabText {
  font-size: 14px;
}

.tab::after {
  content: "";
  position: absolute;
  left: 1px;
  right: 1px;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: transparent;
}

.tab:hover::after {
  background: #cbd5e1;
}

.tab.active::after {
  background: #155dfc;
}

.tabFa {
  width: 16px;
  height: 16px;
  color: inherit;
}

.tab.active {
  color: #155dfc;
}

.content {
  margin: 22px auto;
  padding: 0 16px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.gridTop {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.card {
  background: #ffffff;
  border: 1px solid #e6eaf2;
  border-radius: 18px;
  box-shadow: 0 10px 22px rgba(16, 24, 40, 0.06);
  padding: 24px;
}

.cardHead {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.cardHead--balance {
  margin-bottom: 24px;
}

.cardHeadTitle {
  font-size: 16px;
  font-weight: 400;
  color: #464646;
}

.cardHeadTitle--balance {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.balance {
  border-radius: 16px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.10),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #d946ef;
  background: linear-gradient(135deg, #c800de 0%, #c6005c 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.balance::before,
.balance::after {
  content: "";
  position: absolute;
  width: 128px;
  height: 128px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.10);
  pointer-events: none;
}

.balance::before {
  top: -64px;
  right: -64px;
}

.balance::after {
  bottom: -70px;
  left: -70px;
}

.balance > * {
  position: relative;
  z-index: 1;
}

.balanceValue {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}
.som {
  font-weight: 700;
  opacity: 0.95;
}
.balanceHint {
  font-size: 13px;
  opacity: 0.92;
}

.icon {
  width: 18px;
  height: 18px;
}

.iconBox {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 45px;
}

.iconBox--purple {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.iconBox--green {
  background: #e8f7ee;
  color: #16a34a;
}

.iconBox--orange {
  background: #fff3e8;
  color: #f97316;
}

.tabIcon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.tariffTitle {
  font-weight: 700;
  font-size: 24px;
}

.ticketsCount {
  font-weight: 700;
  font-size: 30px;
  line-height: 1.2;
}
.cardContentSub {
  color: #64748b;
  font-size: 13px;
  margin-bottom: 16px;
}

.btn {
  width: 100%;
  height: 60px;
  border-radius: 12px;
  border: 1px solid #c7c7c745;
  background: #c7c7c745;
  color: #101828;
  font-weight: 600;
  font-size: 16px;
}

.btn:hover {
  background: #b9c8d180;
  border: 2px solid #155dfc;
}

.btnPrimary {
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.plus {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.22);
  font-weight: 600;
}

.sectionCard {
  padding: 18px 18px;
}
.sectionHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}
.sectionTitle {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.linkBtn {
  border: none;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-weight: 600;
}

.services {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.serviceRow {
  border: 1px solid #eef2f7;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.serviceName {
  font-weight: 600;
  font-size: 14px;
}
.serviceDesc {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}
 
.switch {
  position: relative;
  width: 46px;
  height: 26px;
  display: inline-block;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  inset: 0;
  background: #e2e8f0;
  border-radius: 999px;
  transition: 0.2s ease;
}
.slider::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(16, 24, 40, 0.12);
  transition: 0.2s ease;
}
.switch input:checked + .slider {
  background: #22c55e;
}
.switch input:checked + .slider::after {
  transform: translateX(20px);
}

.tickets {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ticketRow {
  border: 1px solid #eef2f7;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.ticketTitle {
  font-weight: 600;
  font-size: 14px;
}
.ticketDate {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.status {
  font-size: 12px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 999px;
  white-space: nowrap;
  border: 1px solid transparent;
}
.stOpen {
  background: #fff7ed;
  color: #f59e0b;
  border-color: #fde68a;
}
.stProgress {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}
.stClosed {
  background: #f1f5f9;
  color: #334155;
  border-color: #e2e8f0;
}

.table {
  width: 100%;
  margin-top: 6px;
}
.row {
  display: grid;
  grid-template-columns: 140px 1fr 140px;
  gap: 12px;
  padding: 14px 10px;
  border-top: 1px solid #eef2f7;
}
.row.head {
  border-top: none;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #64748b;
  font-weight: 600;
  font-size: 12px;
}
.cell {
  font-size: 14px;
  color: #0f172a;
}
.right {
  text-align: right;
}
.pos {
  color: #16a34a;
  font-weight: 600;
}
.neg {
  color: #ef4444;
  font-weight: 600;
}

.linkCenter {
  width: 100%;
  margin-top: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #2563eb;
  font-weight: 600;
  padding: 10px 0;
}

@media (max-width: 980px) {
  .gridTop {
    grid-template-columns: 1fr;
  }
  .services {
    grid-template-columns: 1fr;
  }
  .row {
    grid-template-columns: 120px 1fr 120px;
  }
}
</style>