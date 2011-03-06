class Admin::SbcController < AdminController
  def index
    @section_path = "Adminitration &raquo; "
    @section_title = "SBC Registrations"

    @submenu = global_submenu
    
    @sbcrs = SbcRegistration.find(:all, :order => "created_at DESC")

    @javascripts = "tablesort.js"
  end

  def delete
    r = SbcRegistration.find(params[:id])
    s = r.student
    s.destroy
    r.destroy
  end

  def approve
    r = SbcRegistration.find(params[:id])
    r.approved = !(r.approved)
    r.save

    render :text => r.approved.to_s
  end
end
