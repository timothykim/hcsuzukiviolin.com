class PhotobookController < DisplayController
  
  
  before_filter :login_required
  session :swfupload => true, :only => :processuploads
  session :cookie_only => false, :only => :processuploads
  
  
  def global_submenu
    [ { :name => "<img src=\"/images/icons/home.png\" class=\"icon\" /> Photobook Home", :link => "/photobook" } ]
  end
  
  def index
    @section_title = "Photobooks Home"
    
    
    # @albums = []
    # all_albums = Album.find(:all)
    # for a in all_albums
    #   @albums << a unless a.photos.size == 0
    # end
#    @albums = Album.find(:all, :order => "created_at DESC")

    @albums = Album.paginate :page => params[:page], :order => 'updated_at DESC', :per_page => 12

  end
  
  def new
    @section_path = "Photobooks &raquo; "
    @section_title = "New Photobook"
    @submenu = self.global_submenu
    
    @album = Album.new
  end
  
  
  def album
    @album = Album.find(params[:id])
    @photos = @album.photos
    @photocount = @photos.size


    @submenu = global_submenu + [{ :name => "<img src=\"/images/icons/photobook.png\" class=\"icon\" /> Photobook Summary", :render => "album_summary" }]

    if @album.is_public or current_user.has_permission? @album
      @submenu += [{ :name => "<img src=\"/images/icons/photobook_configure.png\" class=\"icon\" /> Photobook Controls", :render => "album_admin" }]
    end
    
    @submenu += [{ :name => "<img src=\"/images/icons/face-grin.png\" class=\"icon\" /> Latest Comments", :render => "album_latest_comments" }]


    @section_path = "Photobooks &raquo; "
    @section_title = @album.name

  end
  
  
  def photo
    @photo = Photo.find(params[:id])
    @album = @photo.album
    @photos = @photo.album.photos
    
    @prev_photo = @photos.index(@photo) == 0 ? nil : @photos[@photos.index(@photo) - 1]
    @next_photo = @photos.index(@photo) == @photos.length - 1 ? nil : @photos[@photos.index(@photo) + 1]
    
    
    @submenu = global_submenu + [
      { :name => "<img src=\"/images/icons/photoindex.png\" class=\"icon\" /> Back to the Photobook", :link => {:action => 'album', :id => @album } }] + [
          { :name => "Navigation", :render => "album_navigation", :local => {:prev_photo => @prev_photo, :next_photo => @next_photo } }
    ]
    
    @section_path = "Photobooks &raquo; "
    @section_title = "#{@album.name} &raquo; #{@photo.name}"
    
  end
  
  
  
  def deletealbum
    if current_user.has_permission? @album
      @album = Album.find(params[:id])
      @album.destroy
      redirect_to :action => 'index'
    else
      redirect_to :action => 'illegal'
    end
  end
  
  def edit
    unless current_user.has_permission? @album
      redirect_to :action => 'illegal'
    end
    
    @album = Album.find(params[:id])
    @photos = @album.photos
    
    @section_path = "Photobooks &raquo; "
    @section_title = "Editing \"#{@album.name}\""

    @submenu = global_submenu + [
          { :name => "<img src=\"/images/icons/back.png\" class=\"icon\" /> Back to the Photobook", :link => {:action => 'album', :id => @album } },
          { :name => "<img src=\"/images/icons/photobook.png\" class=\"icon\" /> Photobook Summary", :render => "album_summary" }
    ]
    
    if current_user.has_permission? @album
      @submenu += [ { :name => "<img src=\"/images/icons/photobook_configure.png\" class=\"icon\" /> Photobook Controls", :render => "album_admin" } ]
    end

  end
  
  
  def create
    @album = current_user.albums.create!(params[:album])
    redirect_to :action => 'addphotos', :id => @album
  rescue ActiveRecord::RecordInvalid
    render :action => 'new'
  end
  
  def addphotos
    #check for params?
    @album = Album.find(params[:id])
    @photos = @album.photos
    
    @section_path = "Photobooks &raquo; "
    @section_title = "Adding New Photos to \"#{@album.name}\""
    @submenu = global_submenu + [
          { :name => "<img src=\"/images/icons/back.png\" class=\"icon\" /> Back to the Photobook", :link => {:action => 'album', :id => @album } },
          { :name => "<img src=\"/images/icons/photobook.png\" class=\"icon\" /> Photobook Summary", :render => "album_summary" }
    ]
    
    if current_user.has_permission? @album
      @submenu += [ { :name => "<img src=\"/images/icons/photobook_configure.png\" class=\"icon\" /> Photobook Controls", :render => "album_admin" } ]
    end
    
    
    unless current_user.has_permission? @album
      redirect_to :action => 'illegal' unless @album.is_public
    end
  end
  
  def processuploads
    params[:pic] = {}
    album = Album.find(params[:id])

    unless current_user.has_permission? album
      redirect_to :action => 'illegal'
    end

    params[:pic][:uploaded_data] = params[:Filedata]
    params[:pic][:user_id] = current_user.id
    params[:pic][:name] = params[:Filename]
    params[:pic][:description] = album.name
    
    @photo = album.photos.create! params[:pic]
    
    render :layout => false
  end
  
  def illegal
  end
  
  
  def test
    render :layout => false
  end
  
  def album_save
    unless current_user.has_permission? @album
      redirect_to :action => 'illegal'
    end
    
    album = Album.find(params[:album][:id])
    album.name = params[:album][:name]
    album.description = params[:album][:description]
    if params[:album][:key_photo_id]
      album.key_photo_id = params[:album][:key_photo_id]
    end
    album.save
    
    photo_params = params[:photos]
    photos = album.photos
    
    photos.each do |photo|
      param = photo_params["#{photo.id}"]
      if (param[:delete])
        photo.destroy
      else
        unless photo.name == param[:name] and photo.description == param[:description]
          photo.name = param[:name]
          photo.description = param[:description]
          photo.save

          # photo.update_attribute(:name, param[:name])
          # photo.update_attribute(:description, param[:description])


        end
      end
    end
    
    flash[:notice] = "Photobook was successfully saved!"
    redirect_to :action => 'edit', :id => params[:album][:id]
    
  end

end
