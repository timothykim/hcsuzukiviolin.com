class Admin::ChmsRegistrationController < AdminController 

  def index
    @section_path = "Adminstration &raquo; "
    @section_title = "CHMS Registrations"

    @submenu = global_submenu

    @regs = ChmsRegistration.all(:order => "lastname ASC")

    @javascripts = "tablesort.js"
  end

  def delete
    r = ChmsRegistration.find(params[:id])
    r.destroy
  end
end
