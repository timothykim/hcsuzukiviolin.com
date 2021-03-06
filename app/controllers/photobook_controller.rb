class PhotobookController < PageController
  
  before_filter :login_required
  session :swfupload => true, :only => :processuploads
  session :cookie_only => false, :only => :processuploads
  
  
  def global_submenu
    [ { :name => "<img src=\"/images/icons/home.png\" class=\"icon\" /> Photobook Index", :link => "/photobook" } ]
  end
  
  def index
    @section_title = "Photobooks Home"
    
    
    # @albums = []
    # all_albums = Album.find(:all)
    # for a in all_albums
    #   @albums << a unless a.photos.size == 0
    # end
#    @albums = Album.find(:all, :order => "created_at DESC")

    @albums = Album.paginate :page => params[:page], :order => 'created_at DESC', :per_page => 12
    
    @comments = Comment.find(:all, :limit => 5, :order => 'created_at DESC')
  end
  
  def new
    @section_path = "Photobooks &raquo; "
    @section_title = "New Photobook"
    @submenu = self.global_submenu
    
    @album = Album.new
  end
  
  
  def album
    @album = Album.find(params[:id])
    #@photos = Photo.find(:all, :conditions => ["album_id = ?", @album.id], :order => 'created_at ASC')
    @comments = @album.comments

    @photos = @album.photos.paginate :page => params[:page], :order => 'created_at ASC', :per_page => 9

    @photocount = @album.photos.size


    @submenu = global_submenu + [{ :name => "<img src=\"/images/icons/photobook.png\" class=\"icon\" /> Photobook Summary", :render => "album_summary" }]

    @submenu += [{ :name => "<img src=\"/images/icons/photobook_configure.png\" class=\"icon\" /> Photobook Controls", :render => "album_control" }]
    
#    @submenu += [{ :name => "<img src=\"/images/icons/face-grin.png\" class=\"icon\" /> Latest Comments", :render => "album_latest_comments" }]


    @section_path = "Photobooks &raquo; "
    @section_title = @album.name
  end
  
  def makezip
    render :nothing => true
    album = Album.find(params[:id])
    if current_user.has_permission? album
      album.generate_zipfile
    end
  end
  
  
  def get_page
    @photo = Photo.find(params[:photo_id])
    @paginated_photos = Photo.paginate :page => params[:page], :conditions => ["album_id = ?", params[:album_id]], :order => 'created_at ASC', :per_page => params[:per_page]
    @per_page = params[:per_page]
    @album = @photo.album
    
    render :layout => false
  end
  
  def photo
    @per_page = 9
    
    @photo = Photo.find(params[:id])
    @album = @photo.album
    @photos = Photo.find(:all, :conditions => ["album_id = ?", @album.id], :order => 'created_at ASC')
    
    page = (@photos.index(@photo) / @per_page) + 1
    
    @paginated_photos = Photo.paginate :page => page, :conditions => ["album_id = ?", @album.id], :order => 'created_at ASC', :per_page => @per_page
    
    @photoindex = @photos.index(@photo)
    @prev_photo = @photoindex == 0 ? nil : @photos[@photoindex - 1]
    @next_photo = @photoindex == (@photos.size - 1) ? nil : @photos[@photoindex + 1]
    @photoindex += 1
    
    
    @comments = @photo.comments
    
    @new_comment = Comment.new
    
    
    if params[:size] == "big"
      @view = @photo.get_thumbnail(:big)
      @sidebar_offset = 0
      @panel_width = 850
      @prev_margin_left = ((@panel_width - @view.width) / 2).to_i - 2
      @next_margin_left = ((@panel_width - @view.width) / 2).to_i + (@view.width * 0.7).to_i
      @size = params[:size]
    else
      @view = @photo.get_thumbnail(:view)
      @size = ""
      @sidebar_offset = 204
      @panel_width = 625
      @prev_margin_left = ((@panel_width - @view.width) / 2).to_i + 10
      @next_margin_left = ((@panel_width - @view.width) / 2).to_i + 10 + (@view.width * 0.7).to_i
      @submenu = global_submenu + [
                  { :name => "<img src=\"/images/icons/photoindex.png\" class=\"icon\" /> Back to the Photobook", :link => {:action => 'album', :id => @album } },
                  { :name => "<img src=\"/images/icons/photobook.png\" class=\"icon\" /> Navigation", :render => "album_navigation", :local => {:prev_photo => @prev_photo, :next_photo => @next_photo } },
                  { :name => "<img src=\"/images/icons/photo_configure.png\" class=\"icon\" /> Photo Controls", :render => "photo_control" },
                  { :name => "<img src=\"/images/icons/photobook_configure.png\" class=\"icon\" /> Photobook Controls", :render => "album_control" }
              ]
    end
    
    
    @section_path = "Photobooks &raquo; "
    @section_title = "#{@album.name} &raquo; #{@photo.name}"
    
  end
  
  def comment
    c = Comment.create!(params[:comment])
    redirect_to :action => 'photo', :id => params[:comment][:photo_id], :anchor => "comment#{c.id}"
  rescue
    if params[:comment][:content] == ""
      flash[:notice] = "Comments can't be blank!"
    end
    redirect_to :action => 'photo', :id => params[:comment][:photo_id], :anchor => "comment_form"
  end
  
  def deletephoto
    @photo = Photo.find(params[:id])
    @album = @photo.album
    @photos = Photo.find(:all, :conditions => ["album_id = ?", @album.id], :order => 'created_at ASC')
    @prev_photo = @photos.index(@photo) == 0 ? nil : @photos[@photos.index(@photo) - 1]
    @next_photo = @photos.index(@photo) == @photos.length - 1 ? nil : @photos[@photos.index(@photo) + 1]
    
    if current_user.has_permission? photo
      @photo.destroy
    else
      redirect_to :action => 'illegal'
    end
    
    if @prev_photo.nil? and @next_photo.nil?
      redirect_to :action => 'album', :id => @album 
    elsif @next_photo.nil?
      redirect_to :action => 'photo', :id => @prev_photo
    else
      redirect_to :action => 'photo', :id => @next_photo
    end
  end
  
  def delete_comment
    comment = Comment.find(params[:id])
    if current_user.has_permission? comment or current_user.is_admin
      comment.destroy
    end
    #redirect_to :action => 'photo', :id => params[:photo_id], :anchor => "comment_form"
    render :nothing => true
  end
  
  
  def deletealbum
    @album = Album.find(params[:id])

    if current_user.has_permission? @album
      @album.destroy
      redirect_to :action => 'index'
    else
      redirect_to :action => 'illegal'
    end
  end
  
  def edit
    @album = Album.find(params[:id])
    
    unless current_user.has_permission? @album
      redirect_to :action => 'illegal'
    end
    
    @photos = Photo.find(:all, :conditions => ["album_id = ?", @album.id], :order => 'created_at ASC')
    
    @section_path = "Photobooks &raquo; "
    @section_title = "Editing \"#{@album.name}\""

    @submenu = global_submenu + [
          { :name => "<img src=\"/images/icons/back.png\" class=\"icon\" /> Back to the Photobook", :link => {:action => 'album', :id => @album } },
          { :name => "<img src=\"/images/icons/photobook.png\" class=\"icon\" /> Photobook Summary", :render => "album_summary" }
    ]
    
    @submenu += [ { :name => "<img src=\"/images/icons/photobook_configure.png\" class=\"icon\" /> Photobook Controls", :render => "album_control" } ]

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
    
    @submenu += [ { :name => "<img src=\"/images/icons/photobook_configure.png\" class=\"icon\" /> Photobook Controls", :render => "album_control" } ]
    
    
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
    params[:pic][:name] = params[:Filename].gsub(/<\/?[^>]*>/, "")
    params[:pic][:description] = album.name.gsub(/<\/?[^>]*>/, "")
    
    @photo = album.photos.create! params[:pic]
    
    render :layout => false
  end
  
  def illegal
    render :controller => "page", :action => "illegal"
  end
  
  
  def test
    render :layout => false
  end
  
  def album_save
    album = Album.find(params[:album][:id])

    unless current_user.has_permission? @album
      redirect_to :action => 'illegal'
    end
    
    album.name = params[:album][:name]
    album.description = params[:album][:description]
    if params[:album][:key_photo_id]
      album.key_photo_id = params[:album][:key_photo_id]
    end
    album.save
    
    photo_params = params[:photos]
    photos = album.photos
    
    makezip = false
    
    photos.each do |photo|
      param = photo_params["#{photo.id}"]
      if (param[:delete])
        makezip = true
        photo.destroy
      else
        unless photo.name == param[:name] and photo.description == param[:description]
          photo.name = param[:name].gsub(/<\/?[^>]*>/, "")
          photo.description = param[:description].gsub(/<\/?[^>]*>/, "")
          photo.save

          # photo.update_attribute(:name, param[:name])
          # photo.update_attribute(:description, param[:description])

        end
      end
    end


    album.generate_zipfile if makezip

    flash[:notice] = "Photobook was successfully saved!"
    redirect_to :action => 'edit', :id => params[:album][:id]
    
  end

end
