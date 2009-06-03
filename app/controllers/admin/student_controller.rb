class Admin::StudentController < AdminController
  def index
    @section_path = "Adminitration &raquo; "
    @section_title = 'Students'
    
    @submenu = global_submenu
    
    @students = Student.find(:all)

    @javascripts = "tablesort.js"
  end

  def delete
    r = Student.find(params[:id])
    r.destroy
  end
end
