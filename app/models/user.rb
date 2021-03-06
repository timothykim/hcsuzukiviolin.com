require 'digest/sha1'
class User < ActiveRecord::Base
  # Virtual attribute for the unencrypted password
  attr_accessor :password

  has_many :albums
  has_many :photos
  has_many :comments
  has_one  :avatar
<<<<<<< HEAD
=======
  has_many :students
  has_many :registrations, :through => :students
>>>>>>> deploy


  before_validation         :use_email_as_login
  validates_presence_of     :firstname
  validates_presence_of     :lastname
  validates_presence_of     :login
  validates_presence_of     :email
  validates_presence_of     :email_confirmation
  validates_confirmation_of :email
  validates_presence_of     :password,                   :if => :password_required?
  validates_presence_of     :password_confirmation,      :if => :password_required?
  validates_length_of       :password, :within => 4..40, :if => :password_required?
  validates_confirmation_of :password,                   :if => :password_required?
  validates_length_of       :login,    :within => 3..40
  validates_length_of       :email,    :within => 3..100
  validates_uniqueness_of   :email, :case_sensitive => false
  before_save :encrypt_password


  before_save :strip_html
  
  def strip_html
    self.firstname = self.firstname.gsub(/<\/?[^>]*>/, "")
    self.lastname = self.lastname.gsub(/<\/?[^>]*>/, "")
  end

<<<<<<< HEAD
  # Authenticates a user by their login name and unencrypted password.  Returns the user or nil.
  def self.authenticate(login, password)
    u = find_by_login(login) # need to get the salt
=======
  def get_registrations(sess)
    self.registrations.find(:all, :conditions => {:session_id => sess.id})
  end

  # Authenticates a user by their login name and unencrypted password.  Returns the user or nil.
  def self.authenticate(login, password)
    #u = find_by_login(login.downcase) # need to get the salt
    u = User.find(:first, :conditions => ["upper(login) = ?", login.upcase])
>>>>>>> deploy
    u && u.authenticated?(password) ? u : nil
  end

  # Encrypts some data with the salt.
  def self.encrypt(password, salt)
    Digest::SHA1.hexdigest("--#{salt}--#{password}--")
  end

  # Encrypts the password with the user salt
  def encrypt(password)
    self.class.encrypt(password, salt)
  end

  def authenticated?(password)
    crypted_password == encrypt(password)
  end

  def remember_token?
    remember_token_expires_at && Time.now.utc < remember_token_expires_at 
  end

  # These create and unset the fields required for remembering users between browser closes
  def remember_me
    self.remember_token_expires_at = 2.weeks.from_now.utc
    self.remember_token            = encrypt("#{email}--#{remember_token_expires_at}")
    save(false)
  end

  def forget_me
    self.remember_token_expires_at = nil
    self.remember_token            = nil
    save(false)
  end
  
  def email_address_with_name
    "\"#{self.fullname}\" <#{self.email}>"
  end

<<<<<<< HEAD
=======
  def to_s
    self.fullname
  end

>>>>>>> deploy
  def fullname
    self.firstname + " " + self.lastname
  end
  
  def get_avatar
    if self.avatar.nil?
      return "/images/default_avatar.gif"
    else
      return self.avatar.public_filename(:thumb)
    end
  end

  def to_label
    "#{self.fullname}"
  end

  def has_permission?(obj)
    return true if self.is_admin or self == obj.user
    return false
  rescue
    return false
  end

<<<<<<< HEAD
=======
  def sbc_student
    self.students.select {|s| s.sbc_registration } [0]
  end
  

>>>>>>> deploy

  protected
    # before filter 
    def encrypt_password
      return if password.blank?
      self.salt = Digest::SHA1.hexdigest("--#{Time.now.to_s}--#{login}--") if new_record?
      self.crypted_password = encrypt(password)
    end
    
    def use_email_as_login
      self.email = email
      self.login = self.email
    end
    
    def password_required?
      crypted_password.blank? || !password.blank?
    end
end
