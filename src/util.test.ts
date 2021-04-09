import {Const} from './const'
import * as util from './util'
import {mockAircraftsDeep} from './testUtils/mockAircraftsDeep'
import {Cargo, Category} from './types/aircraftDeep'
import {CargoString} from './types/cargoString'
import {v4} from 'uuid'
import {getCargoStringFromTank, getFSofSimpleMoment, getCargoString, getPerMac} from './util'

describe('cut()', () =>
  it('will cut long strings', () => {
    expect(util.cut('a')).toBe('a')
    expect(util.cut('a'.repeat(200))).toBe(
      'a'.repeat(Const.MAX_FORM_LENGTH - 3) + '...'
    )
  }))

describe('formatDate()', () =>
  it('will format dates', () => {
    expect(util.formatDate(new Date('1995-12-17T03:24:00'))).toBe(
      '1995-12-17 11:24 Zulu'
    )
  }))

describe('getCargoSchema()', () =>
  it('will get cargo schema from an aircraft', () => {
    const schema = util.getCargoSchema(mockAircraftsDeep[0])

    const validCargo: CargoString = {
      uuid: v4(),
      name: 'valid cargo',
      weightEA: '100',
      fs: '100',
      qty: '1',
      category: Category.User,
    }

    const inValidCargo: CargoString = {
      uuid: v4(),
      name: 'valid cargo',
      weightEA: 'one two three four',
      fs: '100',
      qty: '1',
      category: Category.Emergency,
    }

    expect(schema.fullObjSchema.isValidSync(validCargo)).toBe(true)
    expect(schema.fullObjSchema.isValidSync(inValidCargo)).toBe(false)
  }))

describe('getCargoStringFromCargo()', () =>
  it('will construct unique CargoStrings from type Cargo with category.user', () => {
    const mockCargo: Cargo = {
      aircraftId: 1,
      cargoId: 1,
      updated: new Date(),
      updatedBy: 'unknown',
      name: 'Water Container (5 Gallon)',
      weight: 40,
      fs: 358,
      category: Category.Steward,
    }

    const cargoString0 = util.getCargoStringFromCargo(mockCargo, 1)
    const cargoString1 = util.getCargoStringFromCargo(mockCargo, 1)

    expect(cargoString0.category).toBe(Category.User)
    expect(cargoString0).not.toStrictEqual(cargoString1)
  }))

describe('getCargoStringsFromConfig()', () =>
  it('will construct unique CargoStrings from type config', () => {
    const cargoStrings: CargoString[] = util.getCargoStringsFromConfig(
      mockAircraftsDeep[0].configs[0]
    )

    expect(cargoStrings.every((c) => c.category === Category.User)).toBe(false)
    expect(cargoStrings.length).not.toBe(0)
  }))

describe('getCargoString()', () =>
  it('will construct unique CargoStrings with category.user', () => {
    expect(getCargoString()).not.toStrictEqual(
      util.getCargoString()
    )
  }))

describe('capitalizeFirst()', () =>
  it('will capitalize first char of string', () =>
    expect(util.capitalizeFirst('teague')).toBe('Teague')))

describe('getFSofSimpleMoment()', () =>
  it('will return 1120', () =>
    expect(
      getFSofSimpleMoment({
        simpleMom: 28,
        momMultiplier: 10000,
        weightEA: 250,
        qty: 1,
      })
    ).toBe(1120)))

describe('getCargoStringFromTank()', () =>
  it('will return new CargoString from a tank', () => {
    const air = mockAircraftsDeep[0]
    const tanksIDX = 0
    const tankWeightsIDX = 0

    const test = getCargoStringFromTank({tanksIDX, tankWeightsIDX, air})
    expect({...test, uuid: '0'}).toStrictEqual({
      name: 'Tank 1',
      weightEA: '250',
      fs: '1120',
      qty: '1',
      uuid: '0',
      category: Category.Tank
    })
  })
)

describe('getPerMac', () => {
  it('will calculate and format cargoStrings into a new PerMac', () => {
    const c17aER = mockAircraftsDeep[0]
    const cargoStrings: CargoString[] = [
      {
        uuid: '0',
        name: 'Basic Aircraft',
        weightEA: '282000',
        fs: '922',
        qty: '1',
        category: Category.BasicAircraft,
      },
      {
        uuid: '1',
        name: 'Tank 1',
        weightEA: '250', // 1C-17A-5-2 2-29: tank1: 250lb, 28 simp mom
        fs: '1120', // = 28 simple mom * 10,000 simple moment modifier / 250
        qty: '1',
        category: Category.Tank,
      },
      {
        uuid: '2',
        name: 'Tank 2 ER',
        weightEA: '25750', // 1C-17A-5-2 2-32: tank 2 ER: 25750lb, 2053 simp mom
        fs: '797.281553398', // = 2053 simple mom * 10,000 simple moment modifier / 25750
        qty: '1',
        category: Category.Tank,
      },
      {
        uuid: '3',
        name: 'Tank 3 ER',
        weightEA: '4500', // 1C-17A-5-2 2-29: tank 3 ER: 4500lb, 380 simp mom
        fs: '844.44444444444444', // = 380 simple mom * 10,000 simple moment modifier / 4500
        qty: '1',
        category: Category.Tank,
      },
      {
        uuid: '4',
        name: 'Tank 4',
        weightEA: '36750', // 1C-17A-5-2 2-34: tank 4: 36750lb, 3,636 simp mom
        fs: '989.387755102', // = 3,636 simple mom * 10,000 simple moment modifier / 36750
        qty: '1',
        category: Category.Tank,
      },
    ]
    
    expect(getPerMac(c17aER, cargoStrings)).toStrictEqual({
      qtyGrandTotal: '5.00',
      momentMultiplier: '10000.00',
      mac: '309.50',
      lemac: '793.60',
      balArm: '919.04',
      momentGrandTotal: '320974000.00',
      simpleMomentGrandTotal: '32097.40',
      weightGrandTotal: '349250.00',
      percentMacDecimal: '0.4053',
      percentMacPercent: '40.53%',
      items: [
        {
          uuid: '0',
          name: 'Basic Aircraft',
          weightEA: '282000.00',
          fs: '922',
          qty: '1',
          category: 'BasicAircraft',
          momentEach: '260004000.00',
          simpleMomentEach: '26000.40',
          weightTotal: '282000.00',
          momentTotal: '260004000.00',
          simpleMomentTotal: '26000.40',
        },
        {
          uuid: '1',
          name: 'Tank 1',
          weightEA: '250.00',
          fs: '1120',
          qty: '1',
          category: 'Tank',
          momentEach: '280000.00',
          simpleMomentEach: '28.00',
          weightTotal: '250.00',
          momentTotal: '280000.00',
          simpleMomentTotal: '28.00',
        },
        {
          uuid: '2',
          name: 'Tank 2 ER',
          weightEA: '25750.00',
          fs: '797.281553398',
          qty: '1',
          category: 'Tank',
          momentEach: '20530000.00',
          simpleMomentEach: '2053.00',
          weightTotal: '25750.00',
          momentTotal: '20530000.00',
          simpleMomentTotal: '2053.00',
        },
        {
          uuid: '3',
          name: 'Tank 3 ER',
          weightEA: '4500.00',
          fs: '844.44444444444444',
          qty: '1',
          category: 'Tank',
          momentEach: '3800000.00',
          simpleMomentEach: '380.00',
          weightTotal: '4500.00',
          momentTotal: '3800000.00',
          simpleMomentTotal: '380.00',
        },
        {
          uuid: '4',
          name: 'Tank 4',
          weightEA: '36750.00',
          fs: '989.387755102',
          qty: '1',
          category: 'Tank',
          momentEach: '36360000.00',
          simpleMomentEach: '3636.00',
          weightTotal: '36750.00',
          momentTotal: '36360000.00',
          simpleMomentTotal: '3636.00',
        },
      ],
    })
  })
})
