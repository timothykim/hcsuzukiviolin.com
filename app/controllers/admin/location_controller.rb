class Admin::LocationController < AdminController
  def index
    @section_path = "Adminitration &raquo; "
    @section_title = 'Locations'
    
    @submenu = global_submenu
    
    @locations = Location.find(:all, :order => "id")

    @options = School.find(:all, :order => "id").collect { |s| "<option value=\"" + s.id.to_s + "\">" + s.name + "</option>" }.join


  end

  def save
    params[:location].each do |id, s|
      if id.to_i < 0
        Location.create(s)
      else
        Location.update(id, s)
      end
    end
    
    redirect_to :action => 'index'
  end

  def delete
    Location.find(params[:id]).destroy()
    redirect_to :action => 'index'
  end

end
