
// import field interface
import { Struct, Query } from '@dashup/module';

// loading
const loading = {};

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
      view   : 'field/model/view',
      input  : 'field/model',
      config : 'field/model/config',
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
      tabs      : ['Config', 'Display'],
      default   : true,
      multiple  : true,
      operators : ['$eq', '$ne', '$in', '$nin', '$exists'],
    };
  }

  /**
   * returns field type
   */
  get icon() {
    // return field type label
    return 'fad fa-link';
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
    return 'External Model Link';
  }

  // load user
  loadModel(id, field, opts) {
    // check loading
    if (loading[id]) return loading[id];

    // return promise
    loading[id] = new Promise((resolve) => {
      // query model
      new Query({
        form   : field?.form?.id || field.form,
        page   : field?.model?.id || field.model,
        model  : field?.model?.id || field.model,
        dashup : opts.dashup,
      }, 'model').findById(id).then(resolve);
    });

    // add timeout
    loading[id].then((data) => {
      // check data
      if (!data) {
        delete loading[id];
        return;
      }

      // cache for 2 seconds
      setTimeout(() => {
        delete loading[id];
      }, 2000);
    });

    // return loading
    return loading[id];
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

    // search by matching field
    const data = await Promise.all(parsed.map((id) => this.loadModel(id, field, opts)));

    // return value map
    return {
      value : data.filter((i) => i).map((item) => item.get('_id')),
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

    // load users
    const models = await Promise.all(value.map((id) => this.loadModel(id, field, opts)));

    // map values
    return {
      sanitised : models.map((val) => val && val.sanitise()).filter((v) => v)
    };
  }
}