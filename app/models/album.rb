# require 'zip/zip'
# require 'zip/zipfilesystem'

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
  
  
  
  
=begin
  def zipfile
    return "/datafiles/albums/" + self.name.split.joing("_") + self.id + ".zip"
  end

  def generate_zipfile
    bundle_filename = "#{RAILS_ROOT}/public/datafiles/" + self.zipfile

    # check to see if the file exists already, and if it does, delete it.
    if File.file?(bundle_filename)
      File.delete(bundle_filename)
    end 

    # set the bundle_filename attribute of this object
    self.bundle_filename = "/uploads/" + self.zipfile

    # open or create the zip file
    Zip::ZipFile.open(bundle_filename, Zip::ZipFile::CREATE) {
      |zipfile|
      # collect the album's tracks
      self.photos {
        |photo|
          # add each track to the archive, names using the track's attributes
          zipfile.add( "#{set}/#{track.num}-#{track.filename}", "#{RAILS_ROOT}/public#{track.public_filename}")
        }
    }

    # set read permissions on the file
    File.chmod(0644, bundle_filename)

    # save the object
    self.save

  end

=end

  private
    def purge_photos
      self.photos.each { |photo| photo.destroy }
    end

end
