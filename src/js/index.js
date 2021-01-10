const sectionTopContent = document.querySelector('.section-top__content');
const sectionBottom = document.querySelector('.section-bottom');
const sectionBottomDetails = document.querySelector('.section-bottom .details');

const quoteBlock = document.querySelector('.quote-block');
const greeting = document.querySelector('.greeting');
const cityAndCountry = document.querySelector('.location');
const time = document.querySelector('.time');

const fetchAppData = async () => {
	try {
		const [ locationInfo, quoteInfo ] = await axios.all([
			await axios.get('http://ip-api.com/json'),
			await axios.get('https://quotes.rest/qod?language=en')
		]);

		const locationData = locationInfo.data;
		const quoteData = quoteInfo.data.contents.quotes[0];

		sectionTopHTML(quoteData, locationData);
		sectionBottomHTML(locationData);
	} catch (err) {
		greeting.innerHTML = `
      <p class="flex">
         Something went wrong <img src="imgs/crying.gif" class="crying-gif" />
      </p>`;
	}
};

fetchAppData();

let timeOfDay,
	dayIcon,
	detailsTitleColor = 'light-mode-font-color';

function checkTime(hoursOfDay) {
	const linearGradient = 'linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.5))';
	if (hoursOfDay < 12) {
		timeOfDay = 'morning';
		dayIcon = 'cloud-sun';
	} else if (hoursOfDay < 18) {
		timeOfDay = 'afternoon';
		dayIcon = 'sun';
		document.body.style.backgroundImage = `${linearGradient}, url('../../imgs/afternoon.jpg')`;
	} else {
		timeOfDay = 'evening';
		dayIcon = 'moon';

		sectionBottom.style.backgroundColor = 'rgba(0, 0, 0, .8)';
		sectionBottom.style.color = 'rgb(222, 227, 231)';
		detailsTitleColor = 'dark-mode-font-color';

		document.body.style.backgroundImage = `${linearGradient}, url('../../imgs/evening.jpg')`;
	}
}

const currentDate = new Date();
const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

const [ hoursOfDay ] = getTime().split(':');
checkTime(hoursOfDay);

function updateTime() {
	setInterval(function() {
		time.innerHTML = getTime();
	}, 1000);
}
updateTime();

function sectionTopHTML(quoteData, locationData) {
	quoteBlock.innerHTML = `
            <div class="quote-block">
               <q>${quoteData.quote}</q>
               <cite class="block bold mt-1">&mdash; ${quoteData.author}</cite>
               <small>source: <a href="${quoteData.permalink}" rel="noreferrer" class="quoteSource" target="_blank">
                  theysaidso.com
               </a></small>
            </div>
            `;
	greeting.innerHTML = `<p class="flex"><i class="icon mr-1 las la-${dayIcon}"></i> Good ${timeOfDay}, It's Currently</p>`;
	cityAndCountry.innerHTML = `<p class="location">IN ${locationData.city}, ${locationData.country}</p>`;
}

function sectionBottomHTML(locationData) {
	sectionBottomDetails.innerHTML = `
         <div class="details__content">
            <div class="details__content--title ${detailsTitleColor}">CURRENT TIME ZONE</div>
            <div class="details__content--info">${locationData.timezone}</div>
         </div>
         <div class="details__content">
            <div class="details__content--title ${detailsTitleColor}">DAY OF THE YEAR</div>
            <div class="details__content--info">${dayOfTheYear()}</div>
         </div>
         <div class="details__content">
            <div class="details__content--title ${detailsTitleColor}">DAY OF THE WEEK</div>
            <div class="details__content--info">${currentDate.getDay() + 1}</div>
         </div>
         <div class="details__content">
            <div class="details__content--title ${detailsTitleColor}">WEEK NUMBER</div>
            <div class="details__content--info">${getWeekNumber()}</div>
         </div>
      `;
}

// utility functions
function formatTime(time) {
	return time < 10 ? `0${time}` : time;
}

function getTime() {
	return `${formatTime(currentDate.getHours())}:${formatTime(currentDate.getMinutes())}`;
}

function dayOfTheYear() {
   // number of days from 1st Jan of currentDate till date
   return Math.ceil((currentDate - firstDayOfYear) / (24 * 60 * 60 * 1000));
}

function getWeekNumber() {
	return Math.ceil((currentDate.getDay() + 1 + dayOfTheYear()) / 7);
}
