class Album < ActiveRecord::Base
  belongs_to      :user, :counter_cache => true
  has_many        :photos
  has_one         :key_photo, :foreign_key => "key_photo_id"
  
  validates_presence_of     :name
  validates_presence_of     :user_id
  
  before_destroy  :purge_photos
  
  def get_key_photo
    if self.key_photo_id
      photo = Photo.find(self.key_photo_id)
    else
      photo = self.photos.find(:first)
    end
  end

  def zipfile
    return "/datafiles/albums/" + 'album_' + self.id.to_s + ".zip"
  end



  def generate_zipfile
    bundle_filename = "#{RAILS_ROOT}/public" + self.zipfile

    # check to see if the file exists already, and if it does, delete it.
    if File.file?(bundle_filename)
      File.delete(bundle_filename)
    end 

    # open or create the zip file
    Zip::ZipFile.open(bundle_filename, Zip::ZipFile::CREATE) {
      |zipfile|
      # collect the album's tracks
      self.photos.each do |photo|
        #print "adding #{RAILS_ROOT}/public#{photo.public_filename}"
        # add each track to the archive, names using the track's attributes
        if FileTest.exists?("#{RAILS_ROOT}/public#{photo.public_filename}")
          zipfile.add( "#{photo.filename}", "#{RAILS_ROOT}/public#{photo.public_filename}")
        end
      end
    }

    # set read permissions on the file
    File.chmod(0644, bundle_filename)
  end


  private
    def purge_photos
      self.photos.each { |photo| photo.destroy }
    end

end
