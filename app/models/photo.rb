class Photo < ActiveRecord::Base
  belongs_to :album, :counter_cache => true
  belongs_to :user, :counter_cache => true

  has_many :comments
  
  
  
  has_attachment  :content_type => :image,
                  :storage => :file_system,
                  :max_size => 5.megabytes,
                  :thumbnails => {:big => '800x600>', :view => '500x375>', :list => "200>", :thumb => [75,75], :icon => [45,45]},
                  :path_prefix => 'public/datafiles/photos'

  validates_as_attachment
  

  def to_label
    "<img src=\"#{self.public_filename(:icon)}\" />"
  end
  
  def get_thumbnail(t = nil)
    ts = self.thumbnails
    if t.nil?
      return ts
    else
      ts.each do |te|
        return te if te.thumbnail == t.to_s
      end
    end
    return nil
  end
  

  
#broken... horribly borken...  
  # 
  # def full_filename(thumbnail = nil)
  #   file_system_path = self.attachment_options[:path_prefix]
  #   folder = self.thumbnail.nil? ? 'original' : self.thumbnail
  #   if folder == 'original'
  #     File.join(RAILS_ROOT, file_system_path, self.album_id, folder, thumbnail_name_for(thumbnail))
  #   else
  #     File.join(RAILS_ROOT, file_system_path, self.album_id, folder, thumbnail_name_for(thumbnail))
  #   end
  # end
  
end
