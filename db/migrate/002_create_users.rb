class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users, :force => true do |t|
      t.column :firstname,                 :string
      t.column :lastname,                  :string
      t.column :login,                     :string
      t.column :email,                     :string
      t.column :crypted_password,          :string, :limit => 40
      t.column :salt,                      :string, :limit => 40
      t.column :created_at,                :datetime
      t.column :updated_at,                :datetime
      t.column :remember_token,            :string
      t.column :remember_token_expires_at, :datetime
      t.column :is_admin,                  :boolean, :default => false
      t.column :activated,                 :boolean, :default => false
    end
    
    #create a admin user
    admin = User.create :firstname => 'Hannah', :lastname => 'Choi', :email => 'admin@admin', :email_confirmation => 'admin@admin', :password => 'password', :password_confirmation => 'password', :is_admin => true, :activated => true
    
    admin.update_attribute(:login, 'admin')
    
  end

  def self.down
    drop_table :users
  end
end


# 
# class CreatePhotos < ActiveRecord::Migration
#   def self.up
#     create_table :photos do |t|
#       t.column :name, :string, :limit => 80
#       t.column :path, :text
#       t.column :caption, :text
#       t.column :album_id, :integer
#       t.column :user_id, :integer
# 
#       t.timestamps
#     end
#   end
# 
#   def self.down
#     drop_table :photos
#   end
# end
# 
# 
# 
# class CreateAlbums < ActiveRecord::Migration
#   def self.up
#     create_table :albums do |t|
#       t.column :name, :string, :limit => 80
#       t.column :user_id, :integer
#       t.column :key_photo_id, :integer
#       t.column :is_public, :boolean, :default => false
#       t.timestamps
#     end
#   end
# 
#   def self.down
#     drop_table :albums
#   end
# end
# 
# 
# class CreateUsers < ActiveRecord::Migration
#   def self.up
#     create_table :users do |t|
#       t.column :first_name, :string
#       t.column :last_name, :string
#       t.column :email, :string
#       t.column :password, :text
#       t.column :is_admin, :boolean, :default => false
#       t.timestamps
#     end
#   end
# 
#   def self.down
#     drop_table :users
#   end
# end
# 
# 
# 
# class CreateComments < ActiveRecord::Migration
#   def self.up
#     create_table :comments do |t|
#       t.column :content, :text
#       t.column :user_id, :integer
#       t.column :photo_id, :integer
# 
#       t.timestamps
#     end
#   end
# 
#   def self.down
#     drop_table :comments
#   end
# end
