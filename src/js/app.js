import { initModal } from './lib/modal';
import { initTabs } from './lib/tabs';

const automaticTabs = document.querySelector('.museum');

initModal();
initTabs(automaticTabs);
