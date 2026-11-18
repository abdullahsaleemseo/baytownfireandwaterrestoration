// Every photo used on the site, with alt text and credit.
// Sources and licenses: CREDITS.md and src/data/credits.json (shown on /disclaimer/).
import dryingLiving from '../assets/images/air-movers-dehumidifier-drying-living-room-floor.jpg';
import meterWall from '../assets/images/moisture-meter-on-water-damaged-wall.jpg';
import dryingOffice from '../assets/images/air-movers-drying-wet-office-floor.jpg';
import movingFurniture from '../assets/images/moving-furniture-off-wet-hardwood-floor.jpg';
import meterFloor from '../assets/images/moisture-meter-on-buckled-hardwood-floor.jpg';
import sootKitchen from '../assets/images/soot-damaged-kitchen-stove-and-cabinets.jpg';
import smokeRoom from '../assets/images/smoke-stained-living-room-walls-and-ceiling.jpg';
import photoDesk from '../assets/images/photographing-fire-damaged-office-desk.jpg';
import boardUp from '../assets/images/fire-damaged-house-boarded-up-with-roof-tarp.jpg';
import extraction from '../assets/images/wet-vacuums-extracting-water-from-warehouse-floor.jpg';
import floodVac from '../assets/images/wet-vacuum-and-squeegee-on-flooded-concrete-floor.jpg';
import squeegee from '../assets/images/squeegee-pushing-water-toward-floor-drain.jpg';
import ceilingStain from '../assets/images/air-movers-drying-bedroom-under-stained-ceiling.jpg';
import chimneyFire from '../assets/images/firefighters-outside-house-with-chimney-fire.jpg';
import garageFire from '../assets/images/firefighters-spraying-water-into-burning-garage.jpg';
import containment from '../assets/images/fire-damaged-kitchen-ceiling-with-containment.jpg';
import debrisSort from '../assets/images/sorting-debris-in-fire-damaged-living-room.jpg';
import brickHouse from '../assets/images/fire-damaged-brick-house-boarded-and-fenced.jpg';
import blocks from '../assets/images/air-movers-and-furniture-blocks-on-wet-floor.jpg';
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
    short: 'Drying a wet living room floor',
    credit: 'Water · Fire · Smoke',
  },
  water: { src: meterWall, alt: 'Gloved hand holding a moisture meter against a water-stained wall with the drywall cut open near the floor' },
  fire: { src: sootKitchen, alt: 'Kitchen cabinets, range hood and tile backsplash blackened with soot after a stove fire, with a worker in a mask taking notes' },
  pipe: { src: pipe, alt: 'Water dripping from a leaking P-trap pipe under a bathroom sink' },
  about: {
    src: bridge,
    alt: 'The Fred Hartman Bridge seen across the water from a marina in Baytown, Texas',
    caption: 'The Fred Hartman Bridge at Baytown. Photo: Patrick Feller, CC BY 2.0.',
  },
  // Images supplied by the site owner (faces blurred). Used inside service pages.
  flood: { src: blocks, alt: 'Standing water across a living room floor with sofa and table legs raised on foam blocks and air movers running' },
  mold: { src: ceilingStain, alt: 'Bedroom with a brown water stain spreading across the ceiling and an opened ceiling section, with air movers and a dehumidifier running' },
  claim: { src: photoDesk, alt: 'Person in protective coveralls photographing a fire-damaged desk and scorched wall to document the damage' },
  hiring: { src: containment, alt: 'Fire-damaged kitchen with plastic containment sheeting taped up and a worker in a respirator moving an air scrubber' },
  firePanel: { src: garageFire, alt: 'Two firefighters in breathing apparatus spraying water into a burning garage attached to a house' },
  figs: {
    extraction: { src: extraction, alt: 'Workers using wet vacuums to extract standing water from a warehouse concrete floor, with a dehumidifier in the foreground', caption: 'Extraction comes first: wet vacuums pull standing water off the floor before drying equipment takes over.' },
    floodVac: { src: floodVac, alt: 'Two workers clearing water from a concrete floor with a wet vacuum and a squeegee near a floor drain', caption: 'Clearing floodwater from a concrete floor with a wet vacuum and squeegee.' },
    squeegee: { src: squeegee, alt: 'Person in rubber boots pushing water across a tiled floor toward a floor drain with a squeegee', caption: 'Pushing standing water toward a floor drain. Getting water off the floor quickly limits how far it spreads.' },
    ceilingStain: { src: ceilingStain, alt: 'Bedroom with a brown water stain across the ceiling and an opened ceiling section, with air movers and a dehumidifier running', caption: 'A stained ceiling opened up to dry the cavity above, with air movers and a dehumidifier running in the room.' },
    chimneyFire: { src: chimneyFire, alt: 'Two-story house at dusk with flames and smoke at the chimney, firefighters and hoses in the driveway', caption: 'Restoration starts only after the fire department has finished and cleared the house.' },
    containment: { src: containment, alt: 'Fire-damaged kitchen with the ceiling opened to the joists, plastic containment sheeting taped up and a worker in a respirator moving an air scrubber', caption: 'Plastic containment and an air scrubber in a fire-damaged kitchen. Ask the company how it will keep soot out of clean rooms.' },
    debrisSort: { src: debrisSort, alt: 'Worker in protective coveralls sorting charred debris and salvageable items into bins in a fire-damaged living room', caption: 'Sorting what can be saved from what cannot after a fire.' },
    smoke: { src: smokeRoom, alt: 'Living room with smoke-stained ceiling and walls, furniture covered in plastic, an air scrubber running and a worker in protective gear wiping a window frame', caption: 'Smoke staining on a ceiling and walls, with furniture covered and an air scrubber running during cleanup.' },
    boardUp: { src: boardUp, alt: 'Fire-damaged house with plywood over the windows and a blue tarp fastened over the burned section of roof', caption: 'Boarded windows and a roof tarp keep rain and trespassers out after a fire.' },
    documenting: { src: photoDesk, alt: 'Person in protective coveralls and a hard hat photographing a fire-damaged desk and scorched wall', caption: 'Photograph damage before anything is moved or thrown away.' },
    waterFloor: { src: meterFloor, alt: 'Moisture meter probes pressed into a buckled, water-stained hardwood floor with an air mover running behind', caption: 'Checking moisture in a buckled hardwood floor. Drying is finished when readings match the dry parts of the house.' },
    burstPipe: { src: movingFurniture, alt: 'Worker lifting a side table off a wet hardwood floor beside a rolled-up rug, with air movers and a dehumidifier running', caption: 'After a leak: furniture lifted off the wet floor, the rug rolled up, and drying equipment running.' },
    flood: { src: blocks, alt: 'Standing water on a living room floor with sofa and table legs raised on foam blocks and air movers running', caption: 'Furniture raised on blocks above standing water while air movers run.' },
    mold: { src: dryingOffice, alt: 'Row of air movers and a dehumidifier drying a wet concrete floor in an empty office', caption: 'Air movers and a dehumidifier drying a wet floor. Fast drying is the main defense against mold.' },
  },
  grid: [
    { src: stain, title: 'Brown ceiling stains', caption: 'Discoloration like this means water got in above, often from a roof leak or an air conditioner drain.', alt: 'Brown water stain along the edge of a textured ceiling', credit: 'Ed!, CC BY-SA 3.0' },
    { src: peeling, title: 'Cracked or peeling paint', caption: 'Paint lifting off water-damaged drywall in a bathroom, with mold spots starting.', alt: 'Paint cracking and peeling from water-damaged drywall', credit: 'Achim Hering, CC BY 3.0' },
    { src: moldCeiling, title: 'Mold after a storm leak', caption: 'Mold that spread across a bedroom ceiling after minor storm leaks were left wet.', alt: 'Mold spreading across a bedroom ceiling and upper walls after storm leaks', credit: 'Infrogmation, CC BY 3.0' },
    { src: brickHouse, title: 'Fire damage and board-up', caption: 'A roof burned through, with windows boarded and the site fenced off after a house fire.', alt: 'Brick house with a burned-out roof, plywood over every window and door, and temporary fencing around it', credit: 'Illustration' },
    { src: ike, title: 'Storm surge and wind damage', caption: 'Bayfront homes in Baytown damaged by Hurricane Ike, September 2008.', alt: 'Bayfront homes in Baytown, Texas damaged by Hurricane Ike in 2008', credit: 'FEMA / Walter Jennings' },
    { src: debris, title: 'What a flood ruins', caption: 'Carpet, insulation and furniture hauled to the curb after a flood. Porous items soaked by floodwater are usually discarded.', alt: 'Flood-damaged carpet, insulation and furniture piled in front of a house', credit: 'FEMA / Marvin Nauman' },
  ],
};
