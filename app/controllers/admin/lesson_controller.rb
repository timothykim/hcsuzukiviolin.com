class Admin::LessonController < AdminController
  def index
    @section_path = "Adminitration &raquo; "
    @section_title = 'Lessons'
    
    @submenu = global_submenu
    
    @sess = Session.find(:all, :order => "first DESC")
  end


  def listing
    @section_path = "Adminitration &raquo; Lessons &raquo; "
    @section_title = 'Listing all Lessons'
    
    @submenu = global_submenu

    @sess = Session.find(params[:id])

    @lessons = @sess.lessons
  end

  def save_location
    l = Lesson.find(params[:id])
    l.location_id = params[:location_id]
    l.save

    redirect_to :action => 'index'
  end
end
