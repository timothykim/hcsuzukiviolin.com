class Admin::RegistrationController < AdminController

  def index
    @section_path = "Adminstration &raquo "
    @section_title = "Registrations"

    @submenu = global_submenu

    @sessions = Session.find(:all, :conditions => {:is_active => true}, :order => "first DESC")
    @schools = School.all
  end
end
