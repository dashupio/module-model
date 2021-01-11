
// import field interface
import { Struct, Query } from '@dashup/module';

/**
 * build address helper
 */
export default class ModelField extends Struct {

  /**
   * construct model field
   *
   * @param args 
   */
  constructor(...args) {
    // run super
    super(...args);

    // save
    this.submit   = this.submit.bind(this);
    this.sanitise = this.sanitise.bind(this);
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      view     : 'field/model/view',
      input    : 'field/model/input',
      config   : 'field/model/config',
      display  : 'field/model/display',
      validate : 'field/model/validate',
    };
  }
  /**
   * returns object of views
   */
  get actions() {
    // return object of views
    return {
      submit   : this.submit,
      sanitise : this.sanitise,
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
      tabs : ['Config', 'Display'],
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
  async submit(opts, field, value) {
    // check value
    if (!value) value = [];
    if (!Array.isArray(value)) value = [value];

    // parsed values
    const parsed = await Promise.all(value.filter(val => val).map(async (val, i) => {
      // run try catch
      try {
        // check mod
        return val._id || val.id || val;
      } catch (e) {
        // return old
        return opts.old[i];
      }
    }));

    // let form
    let form = null;

    // search by matching field
    const data = await Promise.all(parsed.map(async (id) => {
      // check id
      if (!id) return;
      if (`${id}`.match(/^[0-9a-fA-F]{24}$/)) return id;

      // create email
      form = form || await new Query({
        struct : 'form',
      }, 'page').findById((field.form || {}).id);
      
      // form field
      const formField = form ? ((form.get('data.fields') || []).find((f) => f.uuid === (field.model || {}).id || field.model) || {}) : {};

      // query model
      const item = await new Query({
        ...opts,

        form : (field.form || {}).id || field.form,
        page : (field.model || {}).id || field.model,
      }, 'model').where({
        [formField.name || formField.id] : id,
      }).findOne();

      // check item
      if (item) {
        // return value
        return item._id || item.get('_id');
      }
    }));


    // return value map
    return {
      value : data.filter((i) => i),
    };
  }

  /**
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async sanitise(opts, field, value) {
    // get value
    if (!value) value = [];
    if (!Array.isArray(value)) value = [value];

    // filter out not matching
    value = value.filter((v) => v.match(/^[0-9a-fA-F]{24}$/));

    // query model
    const values = await new Query({
      ...opts,

      form : (field.form || {}).id || field.form,
      page : (field.model || {}).id || field.model,
    }, 'model').findByIds(value.map((v) => v.id || v));

    // map values
    return {
      sanitised : (values || []).map((val) => val && val.sanitise()).filter((v) => v)
    };
  }
}