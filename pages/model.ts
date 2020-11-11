
// import page interface
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class ModelPage extends Struct {

  /**
   * returns page type
   */
  get type() {
    // return page type label
    return 'model';
  }

  /**
   * returns page type
   */
  get icon() {
    // return page type label
    return 'fa fa-database';
  }

  /**
   * returns page type
   */
  get title() {
    // return page type label
    return 'Model Page';
  }

  /**
   * returns page data
   */
  get data() {
    // return page data
    return {};
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      view     : 'page/model/view',
      menu     : 'page/model/menu',
      config   : 'page/model/config',
      filter   : 'page/model/filter',
      connects : 'page/model/connects',
    };
  }

  /**
   * returns category list for page
   */
  get categories() {
    // return array of categories
    return ['Model'];
  }

  /**
   * returns page descripton for list
   */
  get description() {
    // return description string
    return 'Model create page';
  }
}