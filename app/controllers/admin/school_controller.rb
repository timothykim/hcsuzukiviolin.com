class Admin::SchoolController < AdminController
  def index
    @section_path = "Adminitration &raquo; "
    @section_title = 'Schools'
    
    @submenu = global_submenu
    
    @schools = School.find(:all, :order => "id")
  end

  def save
    params[:school].each do |id, s|
      if id.to_i < 0
        School.create(s)
      else
        School.update(id, s)
      end
    end
    
    redirect_to :action => 'index'
  end

  def delete
    School.find(params[:id]).destroy()
    redirect_to :action => 'index'
  end

end
