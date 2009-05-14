class Admin::StudentController < AdminController
  def index
    @section_path = "Adminitration &raquo; "
    @section_title = 'Students'
    
    @submenu = global_submenu
    
    @students = Student.find(:all)
  end
end
