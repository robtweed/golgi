module.exports = async function() {
  let build_components = require('./build_components');

  this.component_list = ['sbadmin-root', 'sbadmin-sidebar-toggle', 'sbadmin-brand', 'sbadmin-copyright', 'sbadmin-sidebar-menu', 'sbadmin-sidebar-menu-item', 'sbadmin-sidebar-nested-menu', 'sbadmin-modal', 'sbadmin-content-page', 'sbadmin-spacer', 'sbadmin-form', 'sbadmin-select', 'sbadmin-input', 'sbadmin-card', 'sbadmin-button', 'sbadmin-card-header', 'sbadmin-card-body', 'sbadmin-card-text', 'sbadmin-checkbox-group', 'sbadmin-checkbox', 'sbadmin-sidebar-sub-menu'];

  this.source_folder_def = '/node/sbadmin_c_src';
  this.dest_folder_def = '/node/sbadmin_c';
  this.bundle_filename = 'golgi-components-initial.js';

  build_components.call(this);

}
