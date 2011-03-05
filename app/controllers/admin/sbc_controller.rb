class Admin::SbcController < AdminController
  def index
    @section_path = "Adminitration &raquo; "
    @section_title = "SBC Registrations"

    @submenu = global_submenu
    
    @sbcrs = SbcRegistration.find(:all, :order => "created_at DESC")

    @javascripts = "tablesort.js"
  end
end
