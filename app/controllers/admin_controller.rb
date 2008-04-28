class AdminController < ApplicationController
  include AuthenticatedSystem
  include OptionDictionary

  before_filter :login_from_cookie
  before_filter :login_required
  before_filter :admin_required

  def global_submenu
    [
      { :name => '<img src="/images/icons/users.png" class="icon" /> Users', :link => "/admin/user", :selected => "selected" },
      { :name => '<img src="/images/icons/globe.png" class="icon" /> Site', :link => "#" },
      { :name => '<img src="/images/icons/announce.png" class="icon" /> Announcements', :link => "#" },
      { :name => '<img src="/images/icons/news.png" class="icon" /> Newsletter', :link => "#" }
    ]
  end


  def index
    @section_title = "Administration"
    @submenu = global_submenu
  end
  
  def user
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
  
  def siteoptions

    #display current options
    
    
    
    #styles
    

  end
  
  
end
