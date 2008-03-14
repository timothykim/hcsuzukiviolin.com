class PhotobookController < DisplayController
  
  before_filter :login_required
  
  def new
    @album = Album.new
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
    
    if @album.user != current_user
      redirect_to :action => 'illegal' unless @album.is_public
    end
  end
  
  def processuploads    
    render :layout => false
  end
  
  def illegal
  end
  
end
