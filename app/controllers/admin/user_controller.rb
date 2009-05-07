class Admin::UserController < AdminController
  before_filter :store_location
  #  before_filter :login_from_cookie
  before_filter :login_required
  before_filter :admin_required
  
  def index
    @section_path = "Adminitration &raquo; "
    @section_title = 'User'
    @submenu = global_submenu
    
    @sort_by = {:time => "selected", :name => "", :activated => ""}
    dir = (params[:dir]) ? params[:dir] : "DESC"
    d_sym = (dir == "DESC") ? "&uarr;" : "&darr;"
    @dir_sym = {:time => d_sym, :name => "", :activated => ""}

    sort = "created_at"
    if params[:sort] == "name"
      sort = "lastname"
      @sort_by = {:time => "", :name => "selected", :activated => ""}
      @dir_sym = {:time => "", :name => d_sym, :activated => ""}
    end
    
    if params[:sort] == "activated"
      sort = "activated"
      @sort_by = {:time => "", :name => "", :activated => "selected"}
      @dir_sym = {:time => "", :name => "", :activated => d_sym}
    end
    
    @newdir = (dir == "DESC") ? "ASC" : "DESC"
    
    @users = User.find(:all, :order => "#{sort} #{dir}")
  end
  
  def usersave
    users = User.find(:all)
    
    users.each do |user|
      p = (params[:users]) ? params[:users]["#{user.id}"] : nil
      unless user.is_admin
        if p.nil?
          user.update_attributes!({:activated => false, :email_confirmation => user.email})
        else
          unless user.activated
            user.update_attributes!({:activated => true, :email_confirmation => user.email})
            Notifier.deliver_activation_notification(user)
          end
        end
      end
    end
    
    flash[:notice] = "Save Successful!"
 
    redirect_to :action => "user"
  end
  
  
end
