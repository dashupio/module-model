
// import field interface
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class ModelField extends Struct {
  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      input    : 'field/model/input',
      config   : 'field/model/config',
      display  : 'field/model/display',
      validate : 'field/model/validate',
    };
  }

  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'model';
  }

  /**
   * returns field type
   */
  get data() {
    // return field type label
    return {
      tabs : ['Field', 'Display', 'Validate'],
    };
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Model';
  }

  /**
   * returns category list to show field in
   */
  get categories() {
    // return array of categories
    return ['frontend'];
  }

  /**
   * returns category list to show field in
   */
  get description() {
    // return description string
    return 'Model Field';
  }

  /**
   * submit field value
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, old }, field, value) {
    // check value
    if (!Array.isArray(value)) value = [value];

    // return value map
    return await Promise.all((value || []).filter(val => val).map(async (val, i) => {
      // run try catch
      try {
        // buffer mod
        const mod = await Model.findById(val);

        // check mod
        if (mod) return {
          id    : mod.get('_id'),
          model : 'dashupmodel',
        };

        // return null
        return null;
      } catch (e) {
        // return old
        return old[i];
      }
    }));
  }

  /**
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async sanitise({ req, form, noChild }, field, value) {
    // check noChild
    if (noChild) return value;

    // return
    return value ? (Array.isArray(value) ? (await Promise.all(value.map(async (item) => {
      // check item
      if (!(item instanceof Model) && item.id && item.model) {
        // set item
        item = await Model.findById(item.id);
      }

      // return sanitised
      return item && item.sanitise ? await item.sanitise({ req }) : null;
    }))).filter((item) => item) : (value.sanitise ? await value.sanitise({ req }) : null)) : null;
  }
}