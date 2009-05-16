class Admin::RegistrationController < AdminController

  def index
    @section_path = "Adminstration &raquo "
    @section_title = "Registrations"

    @submenu = global_submenu

    @sessions = Session.find(:all, :conditions => {:is_active => true}, :order => "first DESC")
    @schools = School.all

    @javascripts = "tablesort.js"
  end

  def delete
    r = Registration.find(params[:id])
    r.destroy if r
    redirect_to :action => "index"
  end
end
