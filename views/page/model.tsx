
// import dependencies
import { Dropdown, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { Page, Grid, View, Hbs } from '@dashup/ui';
import React, { useState, useEffect } from 'react';

// create model page
const PageModel = (props = {}) => {
  // groups
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [groups, setGroups] = useState(null);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState(false);
  const [prevent, setPrevent] = useState(false);
  const [updated, setUpdated] = useState(new Date());
  const [selected, setSelected] = useState({ type : 'items', items : [] });
  
  // load groups
  const loadGroups = async () => {
    // check groupBy
    if (!props.page.get('data.group')) return;

    // get groupBy field
    const groupBy = props.getFields().find((f) => f.uuid === props.page.get('data.group'));

    // check groupBy field
    if (!groupBy) return;

    // check if groupBy field has config options
    if (groupBy.options) {
      // return options
      return [...(groupBy.options || [])].map((option) => {
        // check option
        return {
          ...option,

          key : groupBy.name || groupBy.uuid,
        };
      });
    }

    // check if groupBy field is a user field
    if (groupBy.type === 'user') {
      // members
      const members = await eden.router.get(`/app/${props.dashup.get('_id')}/member/query`);

      // return members
      return members.map((member) => {
        // return key
        return {
          key   : groupBy.name || groupBy.uuid,
          label : member.name,
          value : member.id,
        };
      });
    }

    // load other groupBy field by unique in db
    const uniqueGroups = await props.getQuery().count(groupBy.name || groupBy.uuid, true);

    // check counts
    if (uniqueGroups && Object.keys(uniqueGroups).length < 20) {
      // return map
      return Object.keys(uniqueGroups).map((key) => {
        // return key
        return {
          key   : groupBy.name || groupBy.uuid,
          label : key,
          value : key,
        };
      });
    }

    // return nothing
    return null;
  };

  // load data
  const loadData = async (group) => {
    // get query
    const getQuery = () => {
      // return where
      return group ? props.getQuery().where({
        [group.key] : group.value,
      }) : props.getQuery();
    };

    // get total
    const newTotal = await getQuery().count();

    // actual total
    if (group) {
      // set it as logic
      if (false) setTotal({
        ...(typeof total === 'object' ? total : {}),

        [group.value] : newTotal,
      });
    } else {
      // set number total
      setTotal(newTotal);
    }
    
    // loaded items
    const loadedItems = await getQuery().skip(skip).limit(props.page.get('data.limit') || 25).listen();

    // return items
    return {
      total : newTotal,
      items : loadedItems,
    };
  };

  // render field
  const renderField = (item, column) => {
    // find field
    const field = props.getField(column.field);

    // save item
    const saveItem = async () => {
      // set saving
      setSaving(true);

      // save
      await item.save();

      // set saving
      setSaving(false);
    };

    // check if custom
    if (column.field === 'custom') return (
      <div className="grid-column-content">
        <Hbs template={ column.view || '' } data={ item.toJSON() } />
      </div>
    );

    // return no field
    return field && (
      <OverlayTrigger trigger="click" placement="bottom-start" className="grid-column-content" rootClose overlay={ (
        <Popover className="popover-grid">
          <div className="p-2">
            <View
              view="input"
              type="field"
              item={ item }
              field={ field }
              value={ item.get(field.name || field.value) }
              struct={ field.type }
              dashup={ props.dashup }
              column={ column }
              onChange={ (f, value) => item.set(field.name || field.value, value) }
              setPrevent={ setPrevent }
            >
              <div className="text-center">
                <i className="fa fa-spinner fa-spin" />
              </div>
            </View>
            <Button variant="primary" disabled={ saving || prevent } className="w-100" onClick={ (e) => saveItem() }>
              { prevent ? 'Uploading...' : (saving ? 'Saving...' : 'Submit') }
            </Button>
          </div>
        </Popover>
      ) }>
        <div className="grid-column-content">
          <View
            view="view"
            type="field"
            item={ item }
            field={ field }
            value={ item.get(field.name || field.value) }
            struct={ field.type }
            dashup={ props.dashup }
            column={ column }
            >
            <div className="text-center">
              <i className="fa fa-spinner fa-spin" />
            </div>
          </View>
        </div>
      </OverlayTrigger>
    );
  };

  // set actions
  const actions = [
    ...(props.getForms().map((form) => {
      return {
        id      : form.get('_id'),
        icon    : form.get('icon'),
        content : form.get('name'),
      };
    })),

    ...(props.getForms().length ? ['divider'] : []),

    ...(props.getForms()[0] && props.getForms()[0].get ? [{
      id   : 'remove',
      href : (item) => {
        return props.getForms()[0] ? `/app/${props.getForms()[0].get('_id')}/${item.get('_id')}/remove?redirect=/app/${props.page.get('_id')}` : null;
      },
      icon    : 'trash fas',
      content : 'Remove',
      variant : 'danger',
    }] : []),
  ];

  // set tag
  const setTag = async (field, value) => {
    // set tag
    let tags = (props.page.get('user.filter.tags') || []).filter((t) => typeof t === 'object');

    // check tag
    if (tags.find((t) => t.field === field.uuid && t.value === (value?.value || value))) {
      // exists
      tags = tags.filter((t) => t.field !== field.uuid || t.value !== (value?.value || value));
    } else {
      // push tag
      tags.push({
        field : field.uuid,
        value : (value?.value || value),
      });
    }

    // set data
    await props.setUser('filter.tags', tags);
  };

  // set sort
  const setSort = async (column, way = 1) => {
    // let sort
    let sort;

    // check field
    if (
      (column.field !== 'custom' && column.field === props.page.get('data.sort.field')) ||
      (column.field === 'custom' && column.sort === props.page.get('data.sort.sort'))
    ) {
      // reverse sort
      if (props.page.get('data.sort.way') === -1) {
        column = null;
      } else {
        way = -1;
      }
    }
    
    // set sort
    if (!column) {
      sort = null;
    } else {
      // create sort
      sort = {
        way,
  
        id    : column.id,
        sort  : column.sort,
        field : column.field,
      };
    }

    // set data
    await props.setData('sort', sort);
  };

  // set sort
  const setLimit = async (limit = 25) => {
    // set data
    await props.setData('limit', limit);
  };

  // set search
  const setSearch = (search = '') => {
    // set page data
    props.page.set('user.search', search.length ? search : null);
  };

  // set columns
  const setColumns = async (columns) => {
    // set page data
    props.setData('columns', columns);
  };

  // set filter
  const setFilter = async (filter) => {
    // set data
    props.setUser('query', filter, true);
  };

  // is selected
  const isSelected = (item, group) => {
    // check type
    if (selected.type === 'all') return true;
    if (selected.type === 'items') return selected.items.includes(item.get('_id'));
    if (selected.type === 'minus') return !selected.items.includes(item.get('_id'));
  };

  // on select
  const onSelect = (item, group) => {
    // set selected

    // check type
    if (item === 'clear') {
      // fix clear
      selected.type  = 'items';
      selected.items = [];
    } else if (item === 'all') {
      if (selected.type === 'all') {
        selected.type = 'items';
      } else {
        selected.type  = 'all';
        selected.items = [];
      }
    } else {
      // is selected
      const isItemSelected = isSelected(item);
  
      // check type
      if (selected.type === 'all') {
        selected.type  = 'minus';
        selected.items = [item.get('_id')];
      } else if (selected.type === 'items' && isItemSelected) {
        // set item
        selected.items = selected.items.filter((id) => id !== item.get('_id'));
      } else if (selected.type === 'minus' && isItemSelected) {
        // push item
        selected.items.push(item.get('_id'));
      } else if (!isItemSelected) {
        // check minus
        if (selected.type === 'minus') {
          // filter minused item
          selected.items = selected.items.filter((id) => id !== item.get('_id'));

          // check minus
          if (!selected.items.length) selected.type = 'all';
        } else {
          // push
          selected.items.push(item.get('_id'));
        }
      }
    }

    // total
    if (selected.type === 'all') selected.total = total;
    if (selected.type === 'minus') selected.total = total - (selected.items.length);
    if (selected.type === 'items') selected.total = selected.items.length;

    // set selected
    setSelected({ ...selected });
  };

  // use effect
  useEffect(() => {
    // load groups
    loadGroups().then((groups) => {
      setGroups(groups);
    });

    // on update
    const onUpdate = () => {
      setUpdated(new Date());
    };

    // add listener
    props.page.on('data.sort', onUpdate);
    props.page.on('data.group', onUpdate);
    props.page.on('data.filter', onUpdate);
    props.page.on('user.search', onUpdate);
    props.page.on('user.filter.me', onUpdate);
    props.page.on('user.filter.tags', onUpdate);

    // return fn
    return () => {
      // remove listener
      props.page.removeListener('data.sort', onUpdate);
      props.page.removeListener('data.group', onUpdate);
      props.page.removeListener('data.filter', onUpdate);
      props.page.removeListener('user.search', onUpdate);
      props.page.removeListener('user.filter.me', onUpdate);
      props.page.removeListener('user.filter.tags', onUpdate);
    };
  }, [
    props.page.get('_id'),
    props.page.get('type'),
    props.page.get('data.sort'),
    props.page.get('data.group'),
    props.page.get('data.filter'),
    props.page.get('user.search'),
    props.page.get('user.filter.me'),
    props.page.get('user.filter.tags'),
  ]);

  // return jsx
  return (
    <Page { ...props } bodyClass="flex-column">

      <Page.Config show={ config } onHide={ (e) => setConfig(false) } />

      <Page.Menu onConfig={ () => setConfig(true) } onShare>
        <>
          { !props.page.get('data.group') && (
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-limit" className="me-2">
                Per Page:
                <b className="ms-1">{ props.page.get('data.limit') || 25 }</b>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={ (e) => props.setData('limit', 25) }>
                  25
                </Dropdown.Item>
                <Dropdown.Item onClick={ (e) => props.setData('limit', 50) }>
                  50
                </Dropdown.Item>
                <Dropdown.Item onClick={ (e) => props.setData('limit', 75) }>
                  75
                </Dropdown.Item>
                <Dropdown.Item onClick={ (e) => props.setData('limit', 100) }>
                  100
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) }
          { props.dashup.can(props.page, 'submit') && !!props.getForms().length && (
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-create" className="me-2">
                <i className="fat fa-plus me-2" />
                Create
              </Dropdown.Toggle>

              <Dropdown.Menu>
                { props.getForms().map((form) => {

                  // return jsx
                  return (
                    <Dropdown.Item key={ `create-${form.get('_id')}` } onClick={ (e) => props.setData('limit', 25) }>
                      <i className={ `me-2 fa-${form.get('icon') || 'pencil fas'}` } />
                      { form.get('name') }
                    </Dropdown.Item>
                  );
                }) }
              </Dropdown.Menu>
            </Dropdown>
          ) }
        </>
      </Page.Menu>
      <Page.Filter onSearch={ setSearch } onSort={ setSort } onTag={ setTag } onFilter={ setFilter } isString />
      <Page.Body>
        
        { groups && groups.length ? (
          <div className="d-flex flex-column w-100">
            { groups.map((group) => {
              // return jsx
              return (
                <Grid
                  id={ props.page.get('_id') }
                  key={ `group-${group.id || group.label}` }
                  skip={ skip }
                  sort={ props.page.get('data.sort') || {} }
                  limit={ props.page.get('data.limit') || 25 }
                  saving={ saving }
                  columns={ props.page.get('data.columns') || [] }
                  className="w-100"
                  available={ props.getFields() }

                  canAlter={ props.dashup.can(props.page, 'alter') }
                  canSubmit={ props.dashup.can(props.page, 'submit') }

                  setSort={ setSort }
                  setSkip={ setSkip }
                  actions={ actions }
                  loadData={ () => loadData(group) }
                  setLimit={ setLimit }
                  setColumns={ setColumns }
                  renderField={ renderField }
                >
                  <Grid.Group
                    label={ group.label }
                  //  onSelect={ (item) => onSelect(item, group) }
                  //  selected={ selected }
                  //  isSelected={ (item) => isSelected(item, group) }
                  />
                </Grid>
              );
            }) }
          </div>
        ) : (
          <Grid
            id={ props.page.get('_id') }
            skip={ skip }
            sort={ props.page.get('data.sort') || {} }
            limit={ props.page.get('data.limit') || 25 }
            columns={ props.page.get('data.columns') || [] }
            available={ props.getFields() }

            canAlter={ props.dashup.can(props.page, 'alter') }
            canSubmit={ props.dashup.can(props.page, 'submit') }
            fullHeight

            setSort={ setSort }
            setSkip={ setSkip }
            actions={ actions }
            loadData={ loadData }
            setLimit={ setLimit }
            setColumns={ setColumns }
            renderField={ renderField }
          >
            <Grid.Group
              onSelect={ onSelect }
              selected={ selected }
              isSelected={ isSelected }
            />
          </Grid>
        ) }
      </Page.Body>
    </Page>
  );
};

// export default model page
export default PageModel;