class Admin::UsersController < AdminController
  # GET /admin/users
  # GET /admin/users.xml
  def index
    @users = User.find(:all, :conditions => ["is_admin = true"]) | User.find(:all, :conditions => ["activated = true"]) | User.find(:all, :conditions => ["activated = false"])


    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @users }
    end
  end

  # GET /admin/users/1
  # GET /admin/users/1.xml
  def show
    @user = User.find(params[:user_id])
  end

  # GET /admin/users/1/activate
  # ajax
  def activate
    u = User.find(params[:id])
    u.update_attribute(:activated, true)
    render :layout => false
  end


  # GET /admin/users/1/deactivate
  def deactivate
    u = User.find(params[:id])
    u.update_attribute(:activated, false)
    render :layout => false
  end


  # GET /admin/users/new
  # GET /admin/users/new.xml
  def new
    @user = User.new
  end

  # GET /admin/users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # POST /admin/users
  # POST /admin/users.xml
  def create    
    @user = User.new(params[:user])

    @user.save!
    flash[:notice] = 'User was successfully created.'
    redirect_to :action => 'index' unless params[:add_more]

  rescue ActiveRecord::RecordInvalid
    render :action => 'new'
  end

  # PUT /admin/users/1
  # PUT /admin/users/1.xml
  def update
    @user = User.find(params[:user][:id])
    
    if @user.email == params[:user][:email] and params[:user][:email_confirmation] == ""
      params[:user][:email_confirmation] = params[:user][:email]
    end

    if @user.update_attributes(params[:user])
      flash[:notice] = 'User was successfully updated.'
      redirect_to(@user)
    else
      render :action => "edit"
    end
    
  end

  # DELETE /admin/users/1
  # DELETE /admin/users/1.xml
  def destroy
    @user = User.find(params[:id])
    @user.destroy

    redirect_to(users_url)
  end
end
