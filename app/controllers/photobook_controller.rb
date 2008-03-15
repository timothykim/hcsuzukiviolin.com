class PhotobookController < DisplayController
  
  
  before_filter :login_required
  session :swfupload => true, :only => :processuploads
  session :cookie_only => false, :only => :processuploads
  
  
  def index
    @albums = []
    all_albums = Album.find(:all)
    for a in all_albums
      @albums << a unless a.photos.size == 0
    end
  end
  
  def new
    @album = Album.new
  end
  
  
  def album
    @album = Album.find(params[:id])
    @photos = @album.photos
  end
  
  
  def photo
    @photo = Photo.find(params[:id])
    @photolist = @photo.album.photos
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
