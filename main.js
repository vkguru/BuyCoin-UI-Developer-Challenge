const tBody = document.querySelector('tbody');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const rows = document.getElementsByClassName('row');
let start = 0;

const fetchCoins = async (start, limit = 10) => {
  const response = await fetch(`https://api.coinlore.com/api/tickers/?start=${start}&limit=${limit}`);
  const { data } = await response.json();
  return data;
};

const tableRow = ({ symbol, name, price_usd, tsupply } = {}) => {
  const row = document.createElement('tr');
  row.classList.add('row');
  row.innerHTML = `<td>${name}</td>
  <td>${symbol}</td>
  <td>$ ${price_usd}</td>
  <td>${tsupply} ${symbol}</td>`;
  return row;
};

const appendRow = (element, row) => (element.appendChild(row));

const updateRows = (rows, coins) => {
  for (let index = 0; index < rows.length; index++) {
    const { symbol, name, price_usd, tsupply } = coins[index];
    rows[index].innerHTML = `<td>${name}</td>
    <td>${symbol}</td>
    <td>$ ${price_usd}</td>
    <td>${tsupply} ${symbol}</td>`;
  }
}

const toggleNavBtnDisplay = () => {
  start >= 91 ? nextBtn.classList.add('hide') : nextBtn.classList.remove('hide');
  start <= 1 ? prevBtn.classList.add('hide') : prevBtn.classList.remove('hide');
};

const handleNavigation = async (direction) => {
  let coins;
  if (direction === 'next') {
    coins = await fetchCoins(start + 10);
    start = start >= 91 ? 91 : start + 10;
    
  } else if (direction === 'previous') {
    coins = await fetchCoins(start - 10);
    start = start <= 1 ? 1 : start - 10;
    
  }
  toggleNavBtnDisplay();
  updateRows(rows, coins);
};

window.addEventListener('load', async () => {
  const coins = await fetchCoins(start);
  start++;
  coins.forEach(coin => {
    appendRow(tBody, tableRow(coin));
  });
});

nextBtn.addEventListener('click', async () => {
  handleNavigation('next');
});

prevBtn.addEventListener('click', async () => {
  handleNavigation('previous');
});