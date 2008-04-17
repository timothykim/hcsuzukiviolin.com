class CreateAlbumsAndPhotos < ActiveRecord::Migration
  def self.up
    create_table :albums do |t|
      t.column :name, :string, :limit => 80
      t.column :description, :text
      t.column :user_id, :integer
      t.column :key_photo_id, :integer
      t.column :is_public, :boolean, :default => false
      t.timestamps
    end

    create_table :photos do |t|
      t.column :name, :string
      t.column :description, :text
      t.column :album_id, :integer
      t.column :user_id, :integer
      
      t.column :content_type, :string
      t.column :filename, :string     
      t.column :size, :integer
      
      #for thumbnails
      t.column :parent_id, :integer
      t.column :thumbnail, :string
      
      # required for images only
      t.column :width, :integer  
      t.column :height, :integer
      
      t.timestamps
    end

  end

  def self.down
    drop_table :albums
    drop_table :photos
  end
end
