// script.js

// Global object to store project data (for demonstration purposes)
// In a real application, this data would come from a database or API.
window.projectData = {
    user: {
        name: "AMPAULO CASTRO",
        email: "ampcastro@gmail.com",
        goal: "Ser um excelente polímata."
    },
    finances: {
        salaryDetails: {
            salaryDay: 5, // 5th business day of the month
            advanceDay: 20 // 20th day of the month for advance payment
        },
        income: [
            { description: "Salário Julho", amount: 5000.00 }
        ],
        expenses: [
            { description: "Aluguel", amount: 1200.00 },
            { description: "Conta de Luz", amount: 150.00 }
        ]
    },
    workouts: [
        { date: "15/07/2025", type: "Força", description: "Supino (3x10), Agachamento (3x12), Levantamento Terra (3x8)", notes: "Foco na forma, boa execução." },
        { date: "14/07/2025", type: "Cardio", description: "Corrida na esteira (30 min)", notes: "Ritmo constante, bom aquecimento." }
    ],
    runs: [
        { date: "10/07/2025", distance: 5, time: 30 },
        { date: "08/07/2025", distance: 3, time: 18 }
    ],
    meals: [
        { date: "15/07/2025", type: "Almoço", description: "Frango grelhado, brócolis, arroz integral" },
        { date: "14/07/2025", type: "Café da Manhã", description: "Ovos mexidos, pão integral, café" }
    ],
    calendarEvents: [
        { date: "2025-07-25", description: "Deadline do Projeto X" },
        { date: "2025-08-01", description: "Férias" }
    ]
};

// --- DOM Element Selection ---
const navButtons = document.querySelectorAll('.nav-button');
const views = document.querySelectorAll('.view');

// Home View Elements
const userNameInput = document.getElementById('userName');
const userEmailInput = document.getElementById('userEmail');
const userGoalInput = document.getElementById('userGoal');
const saveProfileButton = document.getElementById('saveProfile');

// Hoje View Elements
const dailyWorkoutElement = document.getElementById('dailyWorkout');
const dailyScheduleElement = document.getElementById('dailySchedule');
const financialObligationsElement = document.getElementById('financialObligations');

// Treino View Elements
const workoutListElement = document.getElementById('workoutList');

// Corrida View Elements
const runDateInput = document.getElementById('runDate');
const runDistanceInput = document.getElementById('runDistance');
const runTimeInput = document.getElementById('runTime');
const addRunButton = document.getElementById('addRun');
const runListElement = document.getElementById('runList');

// Nutrição View Elements
const mealDateInput = document.getElementById('mealDate');
const mealTypeSelect = document.getElementById('mealType');
const mealDescriptionInput = document.getElementById('mealDescription');
const addMealButton = document.getElementById('addMeal');
const mealListTableBody = document.querySelector('#mealList tbody');

// Calendário View Elements
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const currentMonthYearHeader = document.getElementById('currentMonthYear');
const calendarGrid = document.getElementById('calendarGrid');
const eventListElement = document.getElementById('eventList');

// Finanças View Elements
const salaryPaymentDatesTableBody = document.getElementById('salaryPaymentDates');
const incomeDescriptionInput = document.getElementById('incomeDescription');
const incomeAmountInput = document.getElementById('incomeAmount');
const addIncomeButton = document.getElementById('addIncome');
const incomeListTableBody = document.getElementById('incomeList');
const expenseDescriptionInput = document.getElementById('expenseDescription');
const expenseAmountInput = document.getElementById('expenseAmount');
const addExpenseButton = document.getElementById('addExpense');
const expenseListTableBody = document.getElementById('expenseList');


// --- Utility Functions ---

/**
 * Formats a number as Brazilian Real currency.
 * @param {number} amount - The amount to format.
 * @returns {string} Formatted currency string.
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}

/**
 * Checks if a given date is a business day (Monday-Friday).
 * @param {Date} date - The date to check.
 * @returns {boolean} True if it's a business day, false otherwise.
 */
function isBusinessDay(date) {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Gets the Nth business day of a month.
 * @param {number} year - The year.
 * @param {number} month - The month (0-indexed).
 * @param {number} n - The Nth business day.
 * @param {boolean} countFromEnd - If true, counts from the end of the month.
 * @returns {Date|null} The date of the Nth business day, or null if not found.
 */
function getNthBusinessDay(year, month, n, countFromEnd = false) {
    let date;
    let businessDaysFound = 0;

    if (countFromEnd) {
        // Start from the last day of the month
        date = new Date(year, month + 1, 0); // Last day of the current month
        while (date.getMonth() === month && businessDaysFound < n) {
            if (isBusinessDay(date)) {
                businessDaysFound++;
            }
            if (businessDaysFound < n) {
                date.setDate(date.getDate() - 1);
            }
        }
    } else {
        // Start from the first day of the month
        date = new Date(year, month, 1);
        while (date.getMonth() === month && businessDaysFound < n) {
            if (isBusinessDay(date)) {
                businessDaysFound++;
            }
            if (businessDaysFound < n) {
                date.setDate(date.getDate() + 1);
            }
        }
    }

    return date.getMonth() === month && businessDaysFound === n ? date : null;
}


/**
 * Gets the next business day for a given date.
 * If the given date is a weekend, it moves to the next Monday.
 * @param {Date} date - The starting date.
 * @returns {Date} The next business day.
 */
function getNextBusinessDay(date) {
    const newDate = new Date(date);
    let day = newDate.getDay();
    let diff = 1; // Default to next day

    if (day === 6) { // Saturday
        diff = 2; // Move to Monday
    } else if (day === 0) { // Sunday
        diff = 1; // Move to Monday
    }
    newDate.setDate(newDate.getDate() + diff);
    return newDate;
}

/**
 * Displays a custom message box instead of alert().
 * @param {string} message - The message to display.
 */
function showMessageBox(message) {
    // Basic implementation: create a simple modal or use a console log for now.
    // For a real app, you'd build a proper modal dialog.
    console.log("Message Box:", message);
    alert(message); // Using alert for simplicity in this demo, but ideally a custom modal.
}


// --- Render Functions ---

/**
 * Renders the user profile data in the Home view.
 */
function renderHomeView() {
    userNameInput.value = window.projectData.user.name;
    userEmailInput.value = window.projectData.user.email;
    userGoalInput.value = window.projectData.user.goal;
}

/**
 * Renders the daily overview for the Hoje view.
 */
function renderHojeView() {
    // Example: Display a specific workout if available
    if (window.projectData.workouts.length > 0) {
        dailyWorkoutElement.textContent = `Último Treino: ${window.projectData.workouts[0].type} em ${window.projectData.workouts[0].date}`;
    } else {
        dailyWorkoutElement.textContent = "Nenhum treino registrado ainda.";
    }

    // Example: Display current financial obligations (simplified)
    financialObligationsElement.innerHTML = '';
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    // Check for salary advance due today (simplified for demo)
    const advancePaymentDay = window.projectData.finances.salaryDetails.advanceDay;
    const advancePaymentDate = new Date(todayYear, todayMonth, advancePaymentDay);
    const nextBusinessAdvance = getNextBusinessDay(advancePaymentDate);

    if (nextBusinessAdvance.getDate() === todayDay && nextBusinessAdvance.getMonth() === todayMonth) {
        const li = document.createElement('li');
        li.textContent = `Adiantamento Salarial - Vencimento hoje!`;
        financialObligationsElement.appendChild(li);
    }

    if (financialObligationsElement.children.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma obrigação financeira urgente hoje.';
        financialObligationsElement.appendChild(li);
    }
}

/**
 * Renders the list of workouts in the Treino view.
 */
function renderTreinoView() {
    workoutListElement.innerHTML = ''; // Clear previous entries
    window.projectData.workouts.forEach(workout => {
        const div = document.createElement('div');
        div.className = 'bg-gray-50 p-4 rounded-lg shadow-sm';
        div.innerHTML = `
            <h3 class="text-xl font-medium text-gray-700 mb-2">${workout.type} - ${workout.date}</h3>
            <p class="text-gray-600">Exercícios: ${workout.description}</p>
            <p class="text-gray-600">Notas: ${workout.notes}</p>
        `;
        workoutListElement.appendChild(div);
    });
}

/**
 * Renders the list of runs in the Corrida view.
 */
function renderCorridaView() {
    runListElement.innerHTML = ''; // Clear previous entries
    window.projectData.runs.forEach(run => {
        const div = document.createElement('div');
        div.className = 'bg-gray-50 p-4 rounded-lg shadow-sm';
        div.innerHTML = `
            <p class="text-gray-700"><strong>${run.date}:</strong> ${run.distance} km em ${run.time} minutos</p>
        `;
        runListElement.appendChild(div);
    });
}

/**
 * Renders the list of meals in the Nutrição view.
 */
function renderNutricaoView() {
    mealListTableBody.innerHTML = ''; // Clear previous entries
    window.projectData.meals.forEach(meal => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-200';
        tr.innerHTML = `
            <td class="px-4 py-2">${meal.date}</td>
            <td class="px-4 py-2">${meal.type}</td>
            <td class="px-4 py-2">${meal.description}</td>
        `;
        mealListTableBody.appendChild(tr);
    });
}

/**
 * Renders the calendar grid for the Calendário view.
 * @param {Date} date - The date to base the calendar on (e.g., current month).
 */
function renderCalendar(date) {
    calendarGrid.innerHTML = ''; // Clear existing calendar
    eventListElement.innerHTML = ''; // Clear existing event list

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed

    currentMonthYearHeader.textContent = `${new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date)}`;

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Get the day of the week for the first day (0=Sunday, 1=Monday, ...)
    const startDayOfWeek = firstDayOfMonth.getDay();

    // Fill in leading empty days from previous month
    for (let i = 0; i < startDayOfWeek; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'p-2 text-gray-400 other-month';
        const prevMonthDay = new Date(year, month, 0).getDate() - (startDayOfWeek - 1 - i);
        dayDiv.textContent = prevMonthDay;
        calendarGrid.appendChild(dayDiv);
    }

    // Fill in days of the current month
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0]; // YYYY-MM-DD

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'p-2 current-month flex flex-col items-center justify-center relative';
        dayDiv.textContent = day;

        const currentDayDate = new Date(year, month, day);
        const currentDayDateString = currentDayDate.toISOString().split('T')[0];

        // Highlight today
        if (currentDayDateString === todayDateString) {
            dayDiv.classList.add('today');
        }

        // Add event markers
        const eventsForThisDay = window.projectData.calendarEvents.filter(event => event.date === currentDayDateString);
        if (eventsForThisDay.length > 0) {
            dayDiv.classList.add('has-event');
            const eventMarker = document.createElement('div');
            eventMarker.className = 'w-1.5 h-1.5 bg-orange-500 rounded-full mt-1';
            dayDiv.appendChild(eventMarker);
        }

        calendarGrid.appendChild(dayDiv);
    }

    // Fill in trailing empty days for the next month
    const totalDaysDisplayed = startDayOfWeek + daysInMonth;
    const remainingCells = 42 - totalDaysDisplayed; // Max 6 rows * 7 days = 42 cells

    for (let i = 1; i <= remainingCells; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'p-2 text-gray-400 other-month';
        dayDiv.textContent = i;
        calendarGrid.appendChild(dayDiv);
    }

    // Render event list
    window.projectData.calendarEvents.forEach(event => {
        const li = document.createElement('li');
        const eventDate = new Date(event.date);
        li.textContent = `${eventDate.toLocaleDateString('pt-BR')}: ${event.description}`;
        eventListElement.appendChild(li);
    });
}

/**
 * Renders the financial data in the Finanças view.
 */
function renderFinancasView() {
    // Render salary payment dates for the next 6 months
    salaryPaymentDatesTableBody.innerHTML = '';
    const today = new Date();
    for (let i = 0; i < 6; i++) {
        const year = today.getFullYear();
        const month = (today.getMonth() + i) % 12; // 0-indexed month
        const displayYear = year + Math.floor((today.getMonth() + i) / 12); // Adjust year for next year's months

        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const monthName = monthNames[month];

        // Get the Nth business day from the end of the month for salary
        const salaryDate = getNthBusinessDay(displayYear, month, window.projectData.finances.salaryDetails.salaryDay, true);
        // Get the next business day for the advance payment
        const advancePaymentDate = getNextBusinessDay(new Date(displayYear, month, window.projectData.finances.salaryDetails.advanceDay));

        const salaryDayFormatted = salaryDate ? salaryDate.getDate() : 'N/A';
        const advanceDayFormatted = advancePaymentDate ? advancePaymentDate.getDate() : 'N/A';

        const row = `
            <tr class="border-b border-gray-200">
                <td class="px-4 py-2">${monthName}/${displayYear}</td>
                <td class="px-4 py-2 text-green-700 font-semibold">Dia ${salaryDayFormatted}</td>
                <td class="px-4 py-2 text-green-700 font-semibold">Dia ${advanceDayFormatted}</td>
            </tr>
        `;
        salaryPaymentDatesTableBody.insertAdjacentHTML('beforeend', row);
    }

    // Render income list
    incomeListTableBody.innerHTML = '';
    window.projectData.finances.income.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-200';
        tr.innerHTML = `
            <td class="px-4 py-2">${item.description}</td>
            <td class="px-4 py-2 text-green-700 font-semibold">${formatCurrency(item.amount)}</td>
            <td class="px-4 py-2">
                <button class="text-red-500 hover:text-red-700 text-sm delete-item" data-type="income" data-index="${index}">Excluir</button>
            </td>
        `;
        incomeListTableBody.appendChild(tr);
    });

    // Render expense list
    expenseListTableBody.innerHTML = '';
    window.projectData.finances.expenses.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-200';
        tr.innerHTML = `
            <td class="px-4 py-2">${item.description}</td>
            <td class="px-4 py-2 text-red-700 font-semibold">${formatCurrency(item.amount)}</td>
            <td class="px-4 py-2">
                <button class="text-red-500 hover:text-red-700 text-sm delete-item" data-type="expense" data-index="${index}">Excluir</button>
            </td>
        `;
        expenseListTableBody.appendChild(tr);
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-item').forEach(button => {
        button.onclick = (event) => {
            const type = event.target.dataset.type;
            const index = parseInt(event.target.dataset.index);
            if (type === 'income') {
                window.projectData.finances.income.splice(index, 1);
            } else if (type === 'expense') {
                window.projectData.finances.expenses.splice(index, 1);
            }
            renderFinancasView(); // Re-render the finance view
            showMessageBox(`${type === 'income' ? 'Receita' : 'Despesa'} excluída com sucesso!`);
        };
    });
}


// --- Event Listeners and Initial Load ---

/**
 * Handles navigation between different views.
 * @param {string} viewId - The ID of the view to show (e.g., 'home', 'financas').
 */
function showView(viewId) {
    views.forEach(view => {
        view.classList.add('hidden'); // Hide all views
        view.classList.remove('active-view');
    });
    const activeView = document.getElementById(`${viewId}-view`);
    if (activeView) {
        activeView.classList.remove('hidden'); // Show the selected view
        activeView.classList.add('active-view');

        // Call specific render functions when a view becomes active
        if (viewId === 'home') renderHomeView();
        if (viewId === 'hoje') renderHojeView();
        if (viewId === 'treino') renderTreinoView();
        if (viewId === 'corrida') renderCorridaView();
        if (viewId === 'nutricao') renderNutricaoView();
        if (viewId === 'calendario') renderCalendar(currentCalendarDate);
        if (viewId === 'financas') renderFinancasView();
    }
}

// Attach event listeners to navigation buttons
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const viewId = button.dataset.view;
        showView(viewId);
    });
});

// Home View - Save Profile
if (saveProfileButton) {
    saveProfileButton.addEventListener('click', () => {
        window.projectData.user.name = userNameInput.value;
        window.projectData.user.email = userEmailInput.value;
        window.projectData.user.goal = userGoalInput.value;
        showMessageBox('Perfil salvo com sucesso!');
    });
}

// Corrida View - Add Run
if (addRunButton) {
    addRunButton.addEventListener('click', () => {
        const date = runDateInput.value;
        const distance = parseFloat(runDistanceInput.value);
        const time = parseInt(runTimeInput.value);

        if (date && !isNaN(distance) && !isNaN(time) && distance > 0 && time > 0) {
            window.projectData.runs.unshift({ date: new Date(date).toLocaleDateString('pt-BR'), distance, time });
            renderCorridaView();
            runDateInput.value = '';
            runDistanceInput.value = '';
            runTimeInput.value = '';
            showMessageBox('Corrida adicionada com sucesso!');
        } else {
            showMessageBox('Por favor, preencha todos os campos corretamente para adicionar a corrida.');
        }
    });
}

// Nutrição View - Add Meal
if (addMealButton) {
    addMealButton.addEventListener('click', () => {
        const date = mealDateInput.value;
        const type = mealTypeSelect.value;
        const description = mealDescriptionInput.value.trim();

        if (date && type && description) {
            window.projectData.meals.unshift({ date: new Date(date).toLocaleDateString('pt-BR'), type, description });
            renderNutricaoView();
            mealDateInput.value = '';
            mealDescriptionInput.value = '';
            mealTypeSelect.value = 'cafe'; // Reset to default
            showMessageBox('Refeição adicionada com sucesso!');
        } else {
            showMessageBox('Por favor, preencha todos os campos para adicionar a refeição.');
        }
    });
}

// Finanças View - Add Income
if (addIncomeButton) {
    addIncomeButton.addEventListener('click', () => {
        const description = incomeDescriptionInput.value.trim();
        const amount = parseFloat(incomeAmountInput.value);

        if (description && !isNaN(amount) && amount > 0) {
            window.projectData.finances.income.push({ description, amount });
            renderFinancasView();
            incomeDescriptionInput.value = '';
            incomeAmountInput.value = '';
            showMessageBox('Receita adicionada com sucesso!');
        } else {
            showMessageBox('Por favor, preencha a descrição e um valor válido para a receita.');
        }
    });
}

// Finanças View - Add Expense
if (addExpenseButton) {
    addExpenseButton.addEventListener('click', () => {
        const description = expenseDescriptionInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value);

        if (description && !isNaN(amount) && amount > 0) {
            window.projectData.finances.expenses.push({ description, amount });
            renderFinancasView();
            expenseDescriptionInput.value = '';
            expenseAmountInput.value = '';
            showMessageBox('Despesa adicionada com sucesso!');
        } else {
            showMessageBox('Por favor, preencha a descrição e um valor válido para a despesa.');
        }
    });
}

// Calendar Navigation
let currentCalendarDate = new Date(); // Start with current month

if (prevMonthButton) {
    prevMonthButton.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar(currentCalendarDate);
    });
}

if (nextMonthButton) {
    nextMonthButton.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar(currentCalendarDate);
    });
}

// Initial render of the Home view when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showView('home'); // Show the home view by default
});
