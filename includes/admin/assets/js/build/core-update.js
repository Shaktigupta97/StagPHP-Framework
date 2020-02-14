// =========================================
// HELPER FUNCTION
// =========================================
function update_core_update_step(message){
  $('#core-update-step-response').append('<li class="spinner-active inner-html div-type-spinner"><span>' + message + '</span></li>').each(function(){
    render_spinner();
  }).find('li:nth-last-child(2)').addClass('checked').each(function(){
    spinner_remove($(this));
  });
}
function error_occurred_core_update_step(){
  $('#core-update-step-response li:nth-last-child(1)').addClass('error').each(function(){
    spinner_remove($(this));
  });
}
function complete_core_update_step(){
  $('#core-update-step-response li:nth-last-child(1)').addClass('checked').each(function(){
    spinner_remove($(this));
  });
}


// =========================================
// AJAX FUNCTION
// =========================================
function stag_core_update_actions(action, function_name){
  $.ajax({
    url: stag_api_ep_core_update,
    method: "POST",
    data: {action: action}
  }).done(function(result){
    var data = JSON.parse(data_received);

    if(!data['status']) {
      stag_php_debug_console('error', 'Update Stopped! description:' + data['description']);
      error_occurred_core_update_step();
      return;
    }

    var result = data['result'];

    if(result['response']){
      stag_php_debug_console('success', data['description']);

      function_name();
    } else {
      stag_php_debug_console('warning', 'Update Stopped! description:' + data['description']);
      error_occurred_core_update_step();
    }
  }).fail(function(jqXHR, textStatus){
    console.log("Request failed: " + textStatus);
  });
}


// =========================================
// SEQUENTIAL FUNCTION
// =========================================
function stag_core_update_check_environment(){
  update_core_update_step('Checking currently configured environment is suitable for automatic update.');

  stag_core_update_actions('check-requirement', 'stag_core_update_create_core_backup');
}

function stag_core_update_create_core_backup(){
  update_core_update_step('Creating backup of the core files.');

  stag_core_update_actions('core-backup', 'stag_core_update_create_core_backup');
}

function stag_core_update_download_update(){
  update_core_update_step('Downloading latest build of StagPHP from official repository.');

  stag_core_update_actions('download-update', 'stag_core_update_extract_files');
}

function stag_core_update_extract_files(){
  update_core_update_step('Extracting files for installation.');

  stag_core_update_actions('extract-files', 'stag_core_update_install_update');
}

function stag_core_update_install_update(){
  update_core_update_step('Installation started.');

  stag_core_update_actions('install-update', 'complete_core_update_step');
}

function stag_core_update_finish_installation(){
  update_core_update_step('Finalizing installation.');

  stag_core_update_actions('finish-update', 'complete_core_update_step');
}

$('#stagphp-core-update-init').on('click', function(){
  stag_core_update_check_environment();
});


// function view_specific_function(){
//   setTimeout(() => {
//     try { update_core_update_step('Just a test 1'); } catch (err) {}
//   }, 100);
//   setTimeout(() => {
//     try { update_core_update_step('Just a test 2'); } catch (err) {}
//   }, 1000);
//   setTimeout(() => {
//     try { update_core_update_step('Just a test 3'); } catch (err) {}
//   }, 1900);
//   setTimeout(() => {
//     try { error_occurred_core_update_step(); } catch (err) {}
//   }, 2800);
// }
