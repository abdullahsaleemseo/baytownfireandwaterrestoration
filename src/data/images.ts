// Every photo used on the site, with alt text and credit.
// Sources and licenses: CREDITS.md and src/data/credits.json (shown on /disclaimer/).
import dryingLiving from '../assets/images/air-movers-dehumidifier-drying-living-room-floor.jpg';
import meterWall from '../assets/images/moisture-meter-on-water-damaged-wall.jpg';
import dryingOffice from '../assets/images/air-movers-drying-wet-office-floor.jpg';
import movingFurniture from '../assets/images/moving-furniture-off-wet-hardwood-floor.jpg';
import meterFloor from '../assets/images/moisture-meter-on-buckled-hardwood-floor.jpg';
import blocks from '../assets/images/air-movers-and-furniture-blocks-on-wet-floor.jpg';
import fireRoom from '../assets/images/fire-damaged-room-interior.jpg';
import pipe from '../assets/images/leaking-pipe-under-sink.jpg';
import bridge from '../assets/images/fred-hartman-bridge-baytown.jpg';
import peeling from '../assets/images/peeling-paint-water-damaged-drywall.jpg';
import moldCeiling from '../assets/images/mold-growth-on-ceiling.jpg';
import ike from '../assets/images/hurricane-ike-damage-baytown.jpg';
import debris from '../assets/images/flood-damaged-belongings-at-curb.jpg';
import stain from '../assets/images/brown-water-stain-on-ceiling.jpg';

export const IMG = {
  hero: {
    src: dryingLiving,
    alt: 'Air movers and a dehumidifier drying a wet hardwood floor in a living room while a technician checks moisture at the wall',
    short: 'Drying a water-damaged living room',
    credit: 'AI-generated image',
  },
  water: { src: meterWall, alt: 'Gloved hand holding a moisture meter against a water-stained wall with the drywall cut open near the floor' },
  fire: { src: fireRoom, alt: 'Room interior blackened by fire, with charred walls and debris on the floor' },
  pipe: { src: pipe, alt: 'Water dripping from a leaking P-trap pipe under a bathroom sink' },
  about: {
    src: bridge,
    alt: 'The Fred Hartman Bridge seen across the water from a marina in Baytown, Texas',
    caption: 'The Fred Hartman Bridge at Baytown. Photo: Patrick Feller, CC BY 2.0.',
  },
  // Illustrations supplied by the site owner (AI-generated; faces blurred). Used inside service pages.
  figs: {
    waterFloor: { src: meterFloor, alt: 'Moisture meter probes pressed into a buckled, water-stained hardwood floor with an air mover running behind', caption: 'Checking moisture in a buckled hardwood floor. Drying is finished when readings match the dry parts of the house.' },
    burstPipe: { src: movingFurniture, alt: 'Worker lifting a side table off a wet hardwood floor beside a rolled-up rug, with air movers and a dehumidifier running', caption: 'After a leak: furniture lifted off the wet floor, the rug rolled up, and drying equipment running.' },
    flood: { src: blocks, alt: 'Standing water on a living room floor with sofa and table legs raised on foam blocks and air movers running', caption: 'Furniture raised on blocks above standing water while air movers run.' },
    mold: { src: dryingOffice, alt: 'Row of air movers and a dehumidifier drying a wet concrete floor in an empty office', caption: 'Air movers and a dehumidifier drying a wet floor. Fast drying is the main defense against mold.' },
  },
  grid: [
    { src: stain, title: 'Brown ceiling stains', caption: 'Discoloration like this means water got in above, often from a roof leak or an air conditioner drain.', alt: 'Brown water stain along the edge of a textured ceiling', credit: 'Ed!, CC BY-SA 3.0' },
    { src: peeling, title: 'Cracked or peeling paint', caption: 'Paint lifting off water-damaged drywall in a bathroom, with mold spots starting.', alt: 'Paint cracking and peeling from water-damaged drywall', credit: 'Achim Hering, CC BY 3.0' },
    { src: moldCeiling, title: 'Mold after a storm leak', caption: 'Mold that spread across a bedroom ceiling after minor storm leaks were left wet.', alt: 'Mold spreading across a bedroom ceiling and upper walls after storm leaks', credit: 'Infrogmation, CC BY 3.0' },
    { src: fireRoom, title: 'Fire and soot damage', caption: 'Charred framing and soot inside a burned house.', alt: 'Charred walls and soot-covered debris inside a house after a fire', credit: 'Niera, CC BY-SA 3.0' },
    { src: ike, title: 'Storm surge and wind damage', caption: 'Bayfront homes in Baytown damaged by Hurricane Ike, September 2008.', alt: 'Bayfront homes in Baytown, Texas damaged by Hurricane Ike in 2008', credit: 'FEMA / Walter Jennings' },
    { src: debris, title: 'What a flood ruins', caption: 'Carpet, insulation and furniture hauled to the curb after a flood. Porous items soaked by floodwater are usually discarded.', alt: 'Flood-damaged carpet, insulation and furniture piled in front of a house', credit: 'FEMA / Marvin Nauman' },
  ],
};
