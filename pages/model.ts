
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
    return 'fad fa-database text-warning';
  }

  /**
   * returns page type
   */
  get title() {
    // return page type label
    return 'Model';
  }

  /**
   * returns page data
   */
  get data() {
    // return page data
    return {
      default : {
        title : 'The Model page requires a Form in order for data to be submitted to it, do you want us to create that page?',
        check : [
          'forms',
        ],
        pages : [
          {
            _id  : 'form',
            type : 'form',
            icon : 'plus fas',
            name : `Create {{ name }}`,
            data : {
              model : '{{ _id }}',
            },
            parent : '{{ _id }}',
          },
        ],
        replace : {
          'data.forms' : ['{{ form }}'],
        },
      },

      share : {
        acls  : ['view'],
        pages : {
          'data.forms' : false,
        },
      }
    };
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      view     : 'page/model',
      config   : 'page/model/config',
      /*
      menu     : 'page/model/menu',
      config   : 'page/model/config',
      filter   : 'page/model/filter',
      connects : 'page/model/connects',
      */
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
    return 'Dashup database model type';
  }
}