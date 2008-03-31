class PhotobookController < DisplayController
  
  
  before_filter :login_required
  session :swfupload => true, :only => :processuploads
  session :cookie_only => false, :only => :processuploads
  
  
  def index
    @section_title = "Photobooks"
    
    
    @albums = []
    all_albums = Album.find(:all)
    for a in all_albums
      @albums << a unless a.photos.size == 0
    end
  end
  
  def new
    @section_path = "Photobooks &raquo; "
    @section_title = "New Photobook"
    @submenu = [
          { :name => "Photobook Home", :link => "/photobook" },
    ]
    
    @album = Album.new
  end
  
  
  def album

    @submenu = [
          { :name => "Photobook Home", :link => "/photobook" },
          { :name => "Download this photobook", :link => "#" },
          { :name => "Latest Comments", :render => "album_latest_comments" }
    ]
    
    @album = Album.find(params[:id])
    @photos = @album.photos

    @section_path = "Photobooks &raquo; "
    @section_title = @album.name

  end
  
  
  def photo
    @photo = Photo.find(params[:id])
    @album = @photo.album
    @photos = @photo.album.photos
    
    @prev_photo = @photos.index(@photo) == 0 ? nil : @photos[@photos.index(@photo) - 1]
    @next_photo = @photos.index(@photo) == @photos.length - 1 ? nil : @photos[@photos.index(@photo) + 1]
    
    
    @submenu = [
          { :name => "Photobook Home", :link => "/photobook" },
          { :name => "Back to #{@album.name}", :link => {:action => "album", :id => @album} },
          { :name => "Navigation", :render => "album_navigation", :local => {:prev_photo => @prev_photo, :next_photo => @next_photo } }
    ]
    
    @section_path = "Photobooks &raquo; #{@album.name} &raquo; "
    @section_title = @photo.name
    
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
    
    @section_path = "Photobooks &raquo; #{@album.name} &raquo; "
    @section_title = "Adding New Photos"
    @submenu = [
          { :name => "Photobook Home", :link => "/photobook" },
          { :name => "View this Photobook", :link => {:action => 'album', :id => @album } },
    ]
    
    if @album.user != current_user
      redirect_to :action => 'illegal' unless @album.is_public
    end
  end
  
  def processuploads
    params[:pic] = {}
    album = Album.find(params[:id])
    params[:pic][:uploaded_data] = params[:Filedata]
    params[:pic][:user_id] = current_user.id
    params[:pic][:name] = params[:Filename]
    params[:pic][:description] = album.name
    
    @photo = album.photos.create! params[:pic]
    
    render :layout => false
  end
  
  def illegal
  end
  
end
